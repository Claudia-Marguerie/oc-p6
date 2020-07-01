const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error: error});
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce);
    })
    .catch((error) => {res.status(404).json({error: error});
    });
};

// exports.createSauce = (req, res, next) => {
//   const sauce = new Sauce({
//     _id: req.params.id,
//     userId: req.body.userId,
//     name: req.body.name,
//     manufacturer: req.body.manufacturer,
//     description: req.body.description,
//     mainPepper: req.body.mainPepper,
//     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
//     heat: req.body.heat,
//     likes: 0,
//     dislikes: 0,
//     usersLiked: [],
//     usersDisliked: [],
//   });
//   sauce.save()
//     .then(() => {res.status(201).json({message: 'Sauce enregistrée !'});
//     })
//     .catch((error) => {res.status(400).json({error: error});
//     });
// });


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// exports.likeSauce = (req, res, next) => {
//   const like = req.body.like;
//   const currentUserId = req.body.userId;
//   const sauceId = req.params.id;
//   // const userExistInSauce = find(sauce.userId, currentUserId);
//   Sauce.findOne({ id: sauceId })
//     .then(sauce => {
//       if (!(sauce.usersLiked.includes(currentUserId) || sauce.usersDisliked.includes(currentUserId))){ // si l'utilisateur n'a pas encore donné son avis: l'id de l'utilisateur n'existe pas dans la liste usersLiked ou usersDisliked de la sauce
//         if (like == 1){ // si il aime la sauce
//           Sauce.updateOne( //{ _id: sauceId }, 
//             {
//               $inc: { likes: 1 }, // incrementer la valeur de likes
//               $addToSet: { usersLiked: currentUserId }, // ajouter son userId dans la liste de usersLiked
//             })
//             .then(() => res.status(201).json({ message: 'Sauce aimée !'}))
//             .catch(error => res.status(400).json({ error }));   
//         }
//         else if (like == -1) { // s'il aime pas la suace
//           Sauce.updateOne( //{ _id: sauceId }, 
//             {
//               $inc: { dislikes: 1 }, // incrementer la valeur de dislikes
//               $addToSet: { usersDisliked: currentUserId }, // ajouter son userId dans la liste de usersDisliked
//             })
//             .then(() => res.status(201).json({ message: 'Sauce non aimée !'}))
//             .catch(error => res.status(400).json({ error }));   
//         }
//       } else if(like == 0){ // si l'utilisatuer annule son avis
//         if(sauce.usersLiked.includes(currentUserId)){ // si l'avis précédent était positif
//           Sauce.updateOne({ //{ _id: sauceId }, 
//             $inc: { likes: -1 }, // la valeur de likes est disminuée d'1
//             $pull: { usersLiked: currentUserId }, // et on efface son userId de la liste de usersLiked
//           })
//           .then(() => res.status(201).json({ message: 'Sauce non aimée !'}))
//           .catch(error => res.status(400).json({ error }));   
//         } 
//         if(sauce.usersDisliked.includes(currentUserId)){ // si l'avis précédent était négatif
//           Sauce.updateOne({ //{ _id: sauceId }, 
//             $inc: { dislikes: -1 }, /// la valeur de dislikes est disminuée d'1
//             $pull: { usersDisliked: currentUserId }, // et on efface son userId de la liste de usersDisliked
//           })
//           .then(() => res.status(201).json({ message: 'Sauce non aimée !'}))
//           .catch(error => res.status(400).json({ error }));   
//         }    
//       }
//       else if (){ // si l'utilisateur a changé son avis
//       // si change d'avis d'un like par un dislike:
//        // la valeur de likes disminué d'1 et
//        // on efface son userId de la liste de usersLiked
 
//        // la valeur de dislikes incrémente d'1
//        // on ajoute son userId de la liste de usersDisliked
 
//      // si change d'avis d'un dislike par un like:
//        // la valeur de dislike disminué d'1 et
//        // on efface son userId de la liste de usersDisliked
 
//        // la valeur de likes incrémente d'1
//        // on ajoute son userId de la liste de usersLiked
//       }
//       else if () { // si l'utilisateur donne le même avis que avant
//       // la valeur de likes reste la même
//        // la valeur de dislikes reste la même
//    } 
//     } 
     
    
//   sauce.save()
//     .then(() => res.status(201).json({ message: 'Sauce aimée !'}))
//     .catch(error => res.status(400).json({ error }));
// };