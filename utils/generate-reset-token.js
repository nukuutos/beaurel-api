module.exports = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  return [resetToken, { hashedResetToken, resetPasswordExpire }];
};
