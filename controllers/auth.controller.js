const crypto = require("crypto");

const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");


const register = asyncHandler(async (req, res, next) => {
    const { name, email, phoneNumber, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    const existingUser = await User.findOne({
        $or: [
            { email },
            ...(phoneNumber ? [{ phoneNumber }] : [])
        ]
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email or phone number already exists"
        });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");


    const user = await User.create({
        name,
        email,
        phoneNumber,
        password,
        verificationToken: crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex"),
        verificationTokenExpires: Date.now() + 10 * 60 * 1000
    });

    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;;

    await sendEmail({
        email: user.email,
        subject: "Verify Your Email",
        html: `
            <h2>Welcome ${user.name}</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}">
                Verify Email
            </a>
            <p>This link will expire in 10 minutes.</p>
        `
    });


    return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email."
    });

});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const user = await User.findOne({
        email,
        isDeleted: false
    }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    if (!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Please verify your email first"
        });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        }
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    const user = await User.findOne({
        email,
        isDeleted: false
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No user found with this email"
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl =
        `http://localhost:5000/api/auth/resetPassword/${resetToken}`;

    await sendEmail({
        email: user.email,
        subject: "Reset Your Password",
        html: `
            <h2>Password Reset</h2>

            <p>
                You requested to reset your password.
            </p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>
                This link will expire in 10 minutes.
            </p>
        `
    });

    return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email"
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
        isDeleted: false
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired reset token"
        });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification token is required",
            data: null
        });
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpires: { $gt: Date.now() },
        isDeleted: false
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token",
            data: null
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: null
    });
});

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyEmail
}