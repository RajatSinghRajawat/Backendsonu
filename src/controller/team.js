const Team = require('../model/team');

const createTeamMember = async (req, res) => {
    try {
        const { name, designation } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }
        
        if (!designation || !designation.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Designation is required' 
            });
        }
        
        // Process image
        let image = '';
        if (req.file) {
            image = `/Uploads/${req.file.filename}`;
        } else if (req.body.image) {
            image = req.body.image;
        }
        
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image is required' 
            });
        }
        
        const teamMember = new Team({ 
            name: name.trim(), 
            designation: designation.trim(), 
            image 
        });
        
        await teamMember.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Team member created successfully', 
            data: teamMember 
        });
    } catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating team member', 
            error: error.message 
        });
    }
};

const getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: teamMembers.length, 
            data: teamMembers 
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching team members', 
            error: error.message 
        });
    }
};

const getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid team member ID' 
            });
        }
        
        const teamMember = await Team.findById(id).select('-__v');
        
        if (!teamMember) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team member not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: teamMember 
        });
    } catch (error) {
        console.error('Error fetching team member:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching team member', 
            error: error.message 
        });
    }
};

const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid team member ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.designation) updateData.designation = req.body.designation.trim();
        
        // Process image - only update if new file is uploaded
        if (req.file) {
            updateData.image = `/Uploads/${req.file.filename}`;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }
        // If no file uploaded and no image in body, keep existing image
        
        // Update team member
        const teamMember = await Team.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!teamMember) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team member not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Team member updated successfully', 
            data: teamMember 
        });
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating team member', 
            error: error.message 
        });
    }
};

const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid team member ID' 
            });
        }
        
        const teamMember = await Team.findByIdAndDelete(id);
        
        if (!teamMember) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team member not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Team member deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting team member', 
            error: error.message 
        });
    }
};

module.exports = { 
    createTeamMember, 
    getAllTeamMembers, 
    getTeamMemberById, 
    updateTeamMember, 
    deleteTeamMember 
};

