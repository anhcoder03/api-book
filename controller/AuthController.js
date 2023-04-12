const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
class UserController {
  register(req, res) {
    const formData = req.body;
    User.findOne({ username: formData.username })
      .then((data) => {
        if (data) {
          res.json("Tên đăng nhập đã tồn tại");
        }
        return bcrypt.hash(formData.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((user) =>
        res.status(201).json({
          message: "Tạo tài khoản thành công!",
          user: user,
        })
      )
      .catch((err) => {
        res.status(400).json("Loi cmnr");
      });
  }
  login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json("Missing username and/or password");
    }
    try {
      User.findOne({ username: username }).then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "Username không đúng!" });
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return res
              .status(400)
              .json({ success: false, message: "Mật khẩu không đúng!" });
          }
          if (user && isMatch) {
            const accessToken = jwt.sign(
              {
                id: user._id,
                admin: user.admin,
              },
              process.env.ACCESS_KEY,
              { expiresIn: "1d" }
            );
            const refreshToken = jwt.sign(
              {
                id: user._id,
                admin: user.admin,
              },
              process.env.REFRESH_KEY,
              { expiresIn: "30d" }
            );
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: false,
              path: "/",
              sameSite: "strict",
            });
            const { password, ...rest } = user._doc;
            res.status(200).json({
              success: true,
              message: "Đăng nhập thành công!",
              ...rest,
              accessToken,
            });
          }
        });
      });
    } catch (err) {
      return res.status(400).json("Lỗi");
    }
  };
  getUsers(req, res, next) {
    User.find({})
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        return res.status(403).json("Lỗi server");
      });
  }
  getUser(req, res, next) {
    const id = req.params.id;
    User.findOne({ _id: id })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        return res.status(500).json("Lỗi server");
      });
  }

  updateUser(req, res, next) {
    const id = req.params.id;
    const formData = req.body;
    User.findOne({ _id: id })
      .then((data) => {
        const user = {
          fullname: formData.fullname,
          username: formData.username,
          image: formData.image,
        };
        User.updateOne({ _id: id }, user)
          .then((data) =>
            res.status(201).json({
              message: "Cập nhật thành công!",
            })
          )
          .catch((err) => {
            res.status(400).json({
              message: "Cập nhật thất bại",
            });
          });
      })
      .catch((err) => {
        res.status(400).json(`Lỗi: ${err}`);
      });
  }
  deleteUser(req, res, next) {
    const id = req.params.id;
    User.deleteOne({ _id: id })
      .then(() => {
        res.status(200).json("Xoá user thành công");
      })
      .catch((err) => {
        res.status(403).json("Xoá user thất bại");
      });
  }

  //create new refresh token

  createNewRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
      if (err) {
        return res.json(401).json(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = jwt.sign(
        {
          id: user._id,
          admin: user.admin,
        },
        process.env.ACCESS_KEY,
        { expiresIn: "1d" }
      );
      const newRefreshToken = jwt.sign(
        {
          id: user._id,
          admin: user.admin,
        },
        process.env.REFRESH_KEY,
        { expiresIn: "30d" }
      );
      refreshTokens(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  };

  logout = async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  };
}
module.exports = new UserController();
