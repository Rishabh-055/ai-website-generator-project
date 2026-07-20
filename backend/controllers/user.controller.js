/**
 * Retrieves information for the authenticated user session
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ 
        message: "User session not found.", 
        user: null 
      });
    }

    // Return the sanitized user payload (without password/sensitive metadata if any)
    return res.status(200).json({
      message: "Current user profile fetched successfully.",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        credit: req.user.credit,
        plan: req.user.plan
      }
    });
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve user profile data." 
    });
  }
};

export default getCurrentUser;