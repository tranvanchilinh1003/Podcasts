const Notification  = require('../../models/notification'); 


exports.Createnotification = async (req, res, next) => {
    const { user_id, sender_id, action, post_id } = req.body;
  
    try {
        const result = await Notification.CreateNotification(user_id, sender_id, action, post_id);
        res.status(201).json({
            data: result,
            notification_id: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  };
exports.getList = async (req, res, next) => {
    const id = req.params.id;

    try {
        const notifications = await Notification.getByUserId(id); 
        res.status(200).json({ data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  };

  exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Notification.deleteNotification(id);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Notification not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
exports.update = async (req, res, next) => {
    let id = req.params.id;
    
    let result = await Notification.updateNotification(id);
    res.status(201).json({
        data: result

    })
};