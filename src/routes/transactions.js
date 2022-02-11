import express from "express";
import { initializePayment, verifyPayment } from "../helpers/paystack";
import Transaction from "../models/transactions";
import User from "../models/user";
import crypto from "crypto";
import Wallet from "../models/gift";
import Notification from "../models/notification";
import auth from "../helpers/auth";
const router = express.Router();

router.post("/payment/create", auth, async (req, res, next) => {
  req.assert("amount", "Please enter the Amount you want to add into your wallet").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    req.flash("success_msg", errors[0].msg);
    return res.redirect("back");
  }

  if (parseInt(req.body.amount) < 50) {
    req.flash("success_msg", "The least you can fund your wallet with is ₦50.");
    return res.redirect("back");
  }

  const paystack_data = {
    amount: parseInt(req.body.amount) * 100,
    email: req.user.email,
    reference: crypto.randomBytes(4).toString("hex"),
  };

  let payment_gateway_response = await initializePayment(paystack_data);

  let transation_payload = {
    userId: req.user.id,
    amount: parseInt(req.body.amount),
    status: "pending",
    reference: paystack_data.reference,
    access_code: payment_gateway_response.data.access_code,
  };

  await Transaction.create(transation_payload);
  if (payment_gateway_response) res.redirect(301, payment_gateway_response.data.authorization_url);
});

router.get("/payment/verify", auth, async (req, res, next) => {
  const { trxref } = req.query;

  if (!trxref) {
    req.flash("success_msg", "Transaction reference not found");
    return res.redirect("/user/dashboard");
  }

  const payment_status = await verifyPayment(trxref);

  let { status, ip_address, reference, currency, channel } = payment_status.data.data;

  await Transaction.updateOne(
    { userId: req.user.id, reference },
    { $set: { status }, ip_address, reference, currency, channel },
  );

  let transaction_id = await Transaction.findOne({ userId: req.user.id, reference });

  if (status == "success") {
    await User.updateOne({ _id: req.user.id }, { $inc: { balance: transaction_id.amount } });

    let notification_payload = {
      receiverId: req.user.id,
      content: `₦${transaction_id.amount
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")} has been deposited into your Wallet!.`,
    };
    await Notification.create(notification_payload);

    req.flash(
      "success_msg",
      "Transaction Successfull. The amount of " +
        transaction_id.amount +
        " has been funded in your wallet",
    );
    return res.redirect("/user/dashboard");
  } else {
    req.flash("success_msg", "Transaction Unsuccessfull");
    return res.redirect("/user/dashboard");
  }
});



router.post("/transfer/create", auth, async (req, res, next) => {
  req.assert("recepient", "Pls enter the receiver's email or virtual account ID").notEmpty();
  req.assert("amount", "Pls enter the amount you will like to Gift out").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    req.flash("success_msg", errors[0].msg);
    return res.redirect("back");
  }

  const { amount, recepient, transaction_remark } = req.body;
  let receiver = await User.findOne({
    _id: { $ne: req.user.id },
    $or: [{ email: recepient }, { virtual_account_id: recepient }],
  });

  if (!receiver) {
    req.flash("success_msg", "The Receiver's account was not found, You can try again.");
    return res.redirect("back");
  }

  const user_has_enough_balance = req.user.balance >= parseInt(amount);

  if (user_has_enough_balance) {
    await Wallet.create({
      senderId: req.user.id,
      receiverId: receiver._id,
      amount: parseInt(amount),
      transaction_remark,
    });

    let sender_current_balance = await User.findById(req.user.id);

    await User.updateOne(
      { _id: req.user.id },
      { $set: { balance: sender_current_balance.balance - parseInt(amount) } },
    );

    await User.updateOne({ _id: receiver._id }, { $inc: { balance: parseInt(amount) } });

    let notification_payload = {
      receiverId: receiver._id,
      content: `₦${parseInt(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")} has been sent to you as a gift from ${
        sender_current_balance.full_name
      }`,
    };
    await Notification.create(notification_payload);

    req.flash("success_msg", "Transfer Successfull. Your wallet balance has been updated.");
    return res.redirect("back");
  } else {
    req.flash(
      "success_msg",
      "Insufficient funds. You don't have enough money in your wallet to make this transfer. Try funding your wallet to continue",
    );
    return res.redirect("back");
  }
});

export default router;
