# recetteJS

L'application côté serveur du projet de recette :

L'application marche de manière très simple,

nous avons 7 routes disponibles dont 2 pour l'identification et l'inscription.

Pour les recettes nous avons :

- ajouter une recette (/add) (protégé par passport)
- supprimer une recette (/delete) (protégé par passport et protégé de façon à que seul l'utilisateur supprime)
- lister toutes les recettes (/list)
- lister une recette spécifique (/get/:id_recette)
- modifier une recette spécifique (/modify/:id_recette/:title_recette/:content_recette (protégé par passport et protégé de façon à que seul l'utilisateur modifie)

Pour l'identification nous avons :

- connexion (/connexion)
- inscription (/inscription)


Pour l'organisation de mon code j'ai décidé d'utiliser un recette controller à qui je délègue toute la logique sur les route pour les recettes :

app.post('/modify',passport.authenticate('jwt', { session: false }),function(req,res)
{
    const user = extract_user(req)
    recetteController.modify(req,res,user)    
})

j'utilise une entité user pour me facilité la tache aussi.
