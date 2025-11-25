const Blog = require('../model/blog');

const createBlog = async (req, res) => {
    try {
        const { name, author, description, content, category, date, excerpt, subHeadings, quotes, highlightPoints } = req.body;
        
        // Process image
        const image = req.file ? `/Uploads/${req.file.filename}` : req.body.image;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Blog title (name) is required' 
            });
        }
        
        if (!author || !author.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Author is required' 
            });
        }
        
        if (!description || !description.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Description is required' 
            });
        }
        
        if (!content || !content.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Content is required' 
            });
        }
        
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                message: 'Featured image is required' 
            });
        }
        
        // Process date
        let blogDate = date ? new Date(date) : new Date();
        if (isNaN(blogDate.getTime())) {
            blogDate = new Date();
        }
        
        // Process subHeadings (array of objects)
        let processedSubHeadings = [];
        if (subHeadings) {
            if (typeof subHeadings === 'string') {
                try {
                    processedSubHeadings = JSON.parse(subHeadings);
                } catch (e) {
                    processedSubHeadings = [];
                }
            } else if (Array.isArray(subHeadings)) {
                processedSubHeadings = subHeadings.filter(sh => sh && (sh.title || sh.content));
            }
        }
        
        // Process quotes (array of strings)
        let processedQuotes = [];
        if (quotes) {
            if (typeof quotes === 'string') {
                try {
                    processedQuotes = JSON.parse(quotes);
                } catch (e) {
                    processedQuotes = quotes.split(',').filter(q => q.trim());
                }
            } else if (Array.isArray(quotes)) {
                processedQuotes = quotes.filter(q => q && q.trim());
            }
        }
        
        // Process highlightPoints (array of strings)
        let processedHighlights = [];
        if (highlightPoints) {
            if (typeof highlightPoints === 'string') {
                try {
                    processedHighlights = JSON.parse(highlightPoints);
                } catch (e) {
                    processedHighlights = highlightPoints.split(',').filter(h => h.trim());
                }
            } else if (Array.isArray(highlightPoints)) {
                processedHighlights = highlightPoints.filter(h => h && h.trim());
            }
        }
        
        const blog = new Blog({ 
            name: name.trim(), 
            author: author.trim(), 
            description: description.trim(), 
            content: content.trim(),
            image,
            category: category ? category.trim() : '',
            date: blogDate,
            excerpt: excerpt ? excerpt.trim() : description.trim().substring(0, 200),
            subHeadings: processedSubHeadings,
            quotes: processedQuotes,
            highlightPoints: processedHighlights
        });
        
        await blog.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Blog created successfully', 
            data: blog 
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating blog', 
            error: error.message 
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.status(200).json({ 
            success: true, 
            count: blogs.length, 
            data: blogs 
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching blogs', 
            error: error.message 
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid blog ID' 
            });
        }
        
        const blog = await Blog.findById(id).select('-__v');
        
        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: blog 
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching blog', 
            error: error.message 
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid blog ID' 
            });
        }
        
        // Process text fields
        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.author) updateData.author = req.body.author.trim();
        if (req.body.description) updateData.description = req.body.description.trim();
        if (req.body.content) updateData.content = req.body.content.trim();
        if (req.body.category) updateData.category = req.body.category.trim();
        if (req.body.excerpt) updateData.excerpt = req.body.excerpt.trim();
        
        // Process image
        if (req.file) {
            updateData.image = `/Uploads/${req.file.filename}`;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }
        
        // Process date
        if (req.body.date) {
            const blogDate = new Date(req.body.date);
            if (!isNaN(blogDate.getTime())) {
                updateData.date = blogDate;
            }
        }
        
        // Process subHeadings
        if (req.body.subHeadings !== undefined) {
            let processedSubHeadings = [];
            if (typeof req.body.subHeadings === 'string') {
                try {
                    processedSubHeadings = JSON.parse(req.body.subHeadings);
                } catch (e) {
                    processedSubHeadings = [];
                }
            } else if (Array.isArray(req.body.subHeadings)) {
                processedSubHeadings = req.body.subHeadings.filter(sh => sh && (sh.title || sh.content));
            }
            updateData.subHeadings = processedSubHeadings;
        }
        
        // Process quotes
        if (req.body.quotes !== undefined) {
            let processedQuotes = [];
            if (typeof req.body.quotes === 'string') {
                try {
                    processedQuotes = JSON.parse(req.body.quotes);
                } catch (e) {
                    processedQuotes = req.body.quotes.split(',').filter(q => q.trim());
                }
            } else if (Array.isArray(req.body.quotes)) {
                processedQuotes = req.body.quotes.filter(q => q && q.trim());
            }
            updateData.quotes = processedQuotes;
        }
        
        // Process highlightPoints
        if (req.body.highlightPoints !== undefined) {
            let processedHighlights = [];
            if (typeof req.body.highlightPoints === 'string') {
                try {
                    processedHighlights = JSON.parse(req.body.highlightPoints);
                } catch (e) {
                    processedHighlights = req.body.highlightPoints.split(',').filter(h => h.trim());
                }
            } else if (Array.isArray(req.body.highlightPoints)) {
                processedHighlights = req.body.highlightPoints.filter(h => h && h.trim());
            }
            updateData.highlightPoints = processedHighlights;
        }
        
        // Update updatedAt
        updateData.updatedAt = Date.now();
        
        // Update blog
        const blog = await Blog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Blog updated successfully', 
            data: blog 
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating blog', 
            error: error.message 
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid blog ID' 
            });
        }
        
        const blog = await Blog.findByIdAndDelete(id);
        
        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Blog deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting blog', 
            error: error.message 
        });
    }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
