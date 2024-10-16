const Background = require("../../models/background");
const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const moment = require('moment-timezone');
const nodemailer = require("nodemailer");

// exports.update = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const { images, background } = req.body; // Assuming images and background are being sent in the request body

//         console.log('Updating customer:', { id, images, background }); // Log received data

//         // Get current customer info from the database
//         const currentCustomer = await Customers.getUpdateCustomers(id);
//         if (!currentCustomer) {
//             return res.status(404).json({ error: 'Customer not found' });
//         }

//         // Destructure current values
//         const { images: oldImages, background: oldBackground } = currentCustomer;

//         // Determine updated images and background
//         const updatedImages = images !== undefined ? images : oldImages; // Use existing if not provided
//         const updatedBackground = background !== undefined ? background : oldBackground; // Use existing if not provided

//         const customers = {
//             images: updatedImages,
//             background: updatedBackground,
//         };

//         // Update customer in the database
//         const result = await Background.updateCustomers(customers, id);

//         res.status(200).json({
//             result,
//             data: customers
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({
//             error: 'Internal Server Error'
//         });
//     }
// };

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { images, background } = req.body; // Expecting URLs in the request body

        // Get current customer info from the database
        const currentCustomer = await Customers.getUpdateCustomers(id);
        if (!currentCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Destructure current values
        const { images: oldImages, background: oldBackground } = currentCustomer;

        // Determine updated images and background
        const updatedImages = images || oldImages; // Use existing if not provided
        const updatedBackground = background || oldBackground; // Use existing if not provided

        // Prepare the customer data to update
        const customers = {
            images: updatedImages,
            background: updatedBackground,
        };

        // Update customer in the database
        const result = await Background.updateCustomers(customers, id);

        res.status(200).json({
            result,
            data: customers
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


