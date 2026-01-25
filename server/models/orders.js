const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./users");

const Order = sequelize.define("Order", {
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, completed, cancelled
    },
    shippingName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingZip: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const OrderItem = sequelize.define("OrderItem", {
    productId: { // We store just ID/Meta in case product changes, but for now ID is fine. 
        // Actually, for history preservation, we should store title/price snapshot.
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Associations
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

module.exports = { Order, OrderItem };
