const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important
const recetteController = require("./Controller/RecetteController")
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const secret = 'thisismysecret'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const cors = require('cors')
const axios = require('axios')
const { User } = require('./Model/User')

const apikey = "87e4e839c80d289bf219f120500fffd747ccb"
axios.defaults.headers.common['x-apikey'] = apikey

const extract_user = function(req)
{
  let token = req.get("Authorization")
  token = token.split("Bearer")

  token = token[1].trim()
  const token_decode = jwt.decode(token)
  const id_user = token_decode.id
  const name_user = token_decode.name
  const lastname_user = token_decode.lastname
  const email_user = token_decode.email

  return new User(name_user,lastname_user,email_user,id_user)
}


const jwtOptions = 
{
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

passport.use(
  new JwtStrategy(jwtOptions, function(payload, next) 
  {
    const email_user = payload.email
    const user = axios.get('https://recettecuisine-7cc3.restdb.io/rest/utilisateur?q={"email":"'+email_user+'"}')

    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })
)

app.use(cors())

app.use(passport.initialize())

app.use(express.json())



app.get('/', function (req, res)
{
    const homeController = require("./Controller/HomeController")
    homeController.index(res);
})

/*app.get('/recette', function (req, res)
{
    
    recetteController.index(req,res)
})*/

app.post('/add',passport.authenticate('jwt', { session: false }),function(req,res)
{
    const user = extract_user(req)
    recetteController.addRecette(req,res,user)
})

app.get('/get',function(req,res)
{
    recetteController.getRecette(req,res)
})

app.get('/list',function(req,res)
{
    recetteController.getList(req,res)
})

app.post('/delete',passport.authenticate('jwt', { session: false }),function(req,res)
{
    const user = extract_user(req)
    recetteController.deleteR(req,res,user)
})

app.post('/modify',passport.authenticate('jwt', { session: false }),function(req,res)
{
    const user = extract_user(req)
    recetteController.modify(req,res,user)    
})
app.post('/connexion',async function(req,res)
{
	const email = req.body.email
  const password = req.body.password

  	if (!email || !password) 
  	{
	    res.status(401).json({ error: 'Email or password was not provided.' })
	    return
  	}
	
		const user_request = await axios.get('https://recettecuisine-7cc3.restdb.io/rest/utilisateur?q={"email":"'+email+'"}')

		const user = user_request.data[0]

	if (!user || user.password !== password) 
	{
	    res.status(401).json({ error: 'Email / password do not match.' })
	    return
	}

	const userJwt = jwt.sign({ email: user.email,name:user.name,lastname:user.lastname,id:user._id }, secret)

	res.json({ jwt: userJwt })
})
app.post('/inscription', async function(req,res)
{
	const email = req.body.email
	const name = req.body.name 
	const lastname = req.body.lastname
	const pass = req.body.pass

	if(!email || !name || !lastname || !pass)
	{
		res.status(401).json({ error: 'Please give email, name, lastname and password' })
	    return
	}
	else
	{

		await axios.post("https://recettecuisine-7cc3.restdb.io/rest/utilisateur",{"email":email,"name":name,"lastname":lastname,"password":pass})
		res.status(200).json({"status-code":"ok"})
	}
})



app.listen(PORT, function ()
{
    console.log('Example app listening on port ' + PORT)
})


