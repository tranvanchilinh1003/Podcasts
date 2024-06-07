const Customers = require("../../models/customers");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());

exports.list = async (req, res, next) => {
    try {
        const customers = await Customers.fetchAll();
        res.status(200).json({
            data: customers
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.create = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        const customers = {
            username: req.body.username,
            full_name: req.body.full_name,
            password: hashedPassword,
            email: req.body.email,
            role: req.body.role,
            gender: req.body.gender,
            images: req.body.images,
            isticket: req.body.isticket,
        };

        const addedCustomers = await Customers.createCustomers(customers);
        res.status(200).json({
            data: addedCustomers,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


exports.detail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Customers.getUpdateCustomers(id);

        res.status(201).json({
            data: result,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;


        let hashedPassword = req.body.password;
        if (hashedPassword) {
            hashedPassword = await bcrypt.hash(req.body.password, 10);
        }

        const customers = {
            username: req.body.username,
            full_name: req.body.full_name,
            password: hashedPassword,
            email: req.body.email,
            role: req.body.role,
            gender: req.body.gender,
            images: req.body.images,
            isticket: req.body.isticket,
        };

        const result = await Customers.updateCustomers(customers, id);

        res.status(201).json({
            data: result
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Customers.deleteCustomers(id);

        res.status(201).json({
            result: result
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};
