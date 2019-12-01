const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true
    },
    password : {
        type : String,
        minlength : 8,
        trim : true,
        required : true  
    }
})

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.statics.login = async(email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
      throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      throw new Error('Unable to login')
  }

  return user
}
// When removed a user, he should be removed from all namespaces, needs to implemented
// userSchema.pre('remove', async function (next) {
//   const user = this
//   await Namespace.find({  })
//   next()
// })


const User = new mongoose.model('User', userSchema)

module.exports = User