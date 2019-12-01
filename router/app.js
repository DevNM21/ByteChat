const app =  require('../server').app
const User = require('../model/User')
const Namespace = require('../model/Namespace')
// console.log('hi');


app.post('/user', async(req,res)=> {
    const user = await User.findOne(req.body)
    if(user) return res.send({exists : 1, user})
    else return res.send({exists : 0})
})

app.get('/register', (req, res)=> {
    res.render('register')
})

app.post('/register', async (req,res)=>{
    try {
        r = req.body
        const user =  new User({
            username : r.username,
            email : r.email,
            password : r.password 
        })
        await user.save()
        
        var sess = req.session
        sess.user = user
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }

})

app.get('/login', (req, res)=> {
    res.render('login')
})

app.post('/login', async(req, res)=> {
    try {
        const user = await User.login(req.body.email,req.body.password)
        req.session.user = user
        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.send(error.toString())
        
    }
    
})

app.get('/namespace', async(req,res)=> {
    const ns = await Namespace.findOne(req.body)
    if(!ns) res.send({exists : 0})
    res.send({exists : 1, namesapce : ns})
})

// app.post('/namespace', async(req, res)=> {
//     if(req.session.user){
//         const ns = await new Namespace({
//             name : 
//         })
//     }


// })

app.get('/', (req,res)=> {
    if(req.session.user){
        const user = req.session.user
        res.render('index', {username : user.username})
    }else {
        res.redirect('/login')
    }
})


module.exports =app