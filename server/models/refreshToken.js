const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const crypto = require("crypto");

const config = {
    jwtRefreshExpiration: 86400,  // 24 hours
};

const RefreshToken = sequelize.define("RefreshToken", {
  token: {
    type: DataTypes.STRING,
  },
  expiryDate: {
    type: DataTypes.DATE,
  },
});

RefreshToken.createToken = async function (user) {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

  let _token = crypto.randomBytes(32).toString('hex');

  let token = await this.create({
    token: _token,
    UserId: user.id,
    expiryDate: expiredAt.getTime(),
  });

  return token.token;
};

RefreshToken.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = RefreshToken;
