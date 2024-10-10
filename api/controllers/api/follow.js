const Follow = require('../../models/follow'); 
const Notification = require('../../models/notification'); 

  exports.followUser = async (req, res, next) => {
    const { follower_id  } = req.body; 
    const followed_id  = parseInt(req.params.id);

    try {
      // Thực hiện các hành động follow
      await Follow.createFollow({ follower_id, followed_id });
      res.status(200).json({ message: 'Follow successful' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ error: 'An error occurred while following user' });
    }
  };

exports.unfollowUser = async (req, res, next) => {
  const { follower_id  } = req.body; 
    const followed_id  = parseInt(req.params.id);

    try {
    
        const result = await Follow.removeFollow(follower_id, followed_id);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Not following this user.' });
        }

        res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'An error occurred while unfollowing the user.' });
    }
};
exports.checkFollow = async (req, res, next) => {
  const followerId = req.params.id; 
  const followedId = req.query.followed_id; 

  try {
      const result = await Follow.checkFollow(followedId, followerId); 

      const isFollowing = result[0].count > 0;
      res.json({ isFollowing });
  } catch (error) {
      console.error('Error checking follow status:', error);
      res.status(500).json({ error: 'An error occurred while checking the follow status.' });
  }
};


exports.checkLike = async (req, res, next) => {
  const userId = req.query.userId;
  try {
    const likedPosts = await Follow.checkLike(userId);
    res.json(likedPosts);
} catch (err) {
    console.error('Lỗi:', err);
    res.status(500).json({ error: 'Có lỗi xảy ra.' });
}
};

exports.add = async (req, res, next) => {
  const { post_id, customers_id } = req.body;

  try {
    const likedPosts = await Follow.addLike(post_id, customers_id);
    
} catch (err) {
    console.error('Lỗi:', err);
    res.status(500).json({ error: 'Có lỗi xảy ra.' });
}
};

exports.delete = async (req, res, next) => {
  const { post_id, customers_id } = req.body;
  try {
    const likedPosts = await Follow.deleteLike(post_id, customers_id);
} catch (err) {
    console.error('Lỗi:', err);
    res.status(500).json({ error: 'Có lỗi xảy ra.' });
}
};
exports.listFollowed = async (req, res, next) => {
   const id = req.params.id;
   try {
    const follows = await Follow.list_follow(id);
    res.status(200).json({
        data: follows,
      })
   }catch(err){

   }
  
};
exports.listFollower = async (req, res, next) => {
   const id = req.params.id;
   try {
    const follows = await Follow.list_follower(id);
    res.status(200).json({
        data: follows,
      })
   }catch(err){

   }
  
};





