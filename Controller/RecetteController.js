const axios = require('axios')
const jwt = require('jsonwebtoken')
const apikey = "87e4e839c80d289bf219f120500fffd747ccb"
axios.defaults.headers.common['x-apikey'] = apikey

const { Recette } = require('../Model/Recette')

const addRecette = async function(req,res,user)
{
   const title = req.body.title
   const content = req.body.content
  

   if(!title || !content)
   {
      res.status(401).json({ error: 'Please give title and content' })
      return
   }

   await axios.post("https://recettecuisine-7cc3.restdb.io/rest/recette",{"title":title,"content":content,"user":[user.id]})
   res.status(200).json({"status-code":"ok"})
}

const getRecette = async function(req,res)
{
   const id_recete = req.query.idrecette
   const url_recette = "https://recettecuisine-7cc3.restdb.io/rest/recette/"+id_recete
   const recette = await axios.get(url_recette)
  
   res.json(recette.data)
}

const getList = async function(req,res)
{
   const recette1 = await axios.get("https://recettecuisine-7cc3.restdb.io/rest/recette")
   
   res.json(recette1.data)
}

const deleteR = async function(req,res,user)
{
   const id_recete = req.body.idrecette

   if(id_recete)
   {
      const url_recette = "https://recettecuisine-7cc3.restdb.io/rest/recette/"+id_recete
      const recette_json = await axios.get(url_recette)
      
      let id_user_demandeur = recette_json.data.user[0]._id
     
      if(id_user_demandeur === user.id)
      {
         await axios.delete(url_recette)
         res.status(200).json({"status":"ok"})
      }
      return
      
   }
   return
}

const modify =async function(req,res,user)
{
   const id_recete = req.body.idrecette
   const title_recete = req.body.title
   const content_recete = req.body.content
   if(id_recete && title_recete && content_recete)
   {
      const a = await axios.get("https://recettecuisine-7cc3.restdb.io/rest/recette")
      console.log(a)
      const url_recette = "https://recettecuisine-7cc3.restdb.io/rest/recette/"+id_recete
      const recette_json = await axios.get(url_recette)
      
      let id_user_demandeur = recette_json.data.user[0]._id
     
      if(id_user_demandeur === user.id)
      {
         axios.patch(url_recette,{"title":title_recete,"content":content_recete})
         res.status(200).json({"status":"ok"})
      }
      return
      
   }
   return
}

exports.addRecette = addRecette

exports.getRecette = getRecette

exports.getList = getList

exports.deleteR = deleteR

exports.modify = modify