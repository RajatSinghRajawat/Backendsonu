const Contact = require('../model/contact');

const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ success: true, message: 'Contact created successfully', data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating contact', error: error.message });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
    }
};

const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching contact', error: error.message });
    }
};

const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.status(200).json({ success: true, message: 'Contact updated successfully', data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating contact', error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting contact', error: error.message });
    }
};

module.exports = { createContact, getAllContacts, getContactById, updateContact, deleteContact };
