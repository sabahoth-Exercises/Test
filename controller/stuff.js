const Thing = require('../model/thing');
const fs = require('fs');

/**
 * Контроллер для работы с CRUD операциями для продуктов (или товаров, которые должны быть проданы)
 * @param req: параметр запроса.
 * @param res: параметр ответа.
 * @param next: указание на выполнение следующего блока.
 */

//создание нового продукта
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,//только для аутентифицированных пользователей
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
        .then(() => { res.sendStatus(201).json({message: 'Product successfully added !'})})
        .catch(error => { res.sendStatus(400).json( { error })})
};

//Просмотр отдельного продукта с его описанием
exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.sendStatus(200).json(thing);
        }
    ).catch(
        (error) => {
            res.sendStatus(404).json({
                error
            });
        }
    );
};

//удалить или изменить продукт может только тот, кто его создал
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };


    delete thingObject._userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId !== req.auth.userId) {//только для аутентифицированных пользователей
                res.sendStatus(401).json({ message : 'Not authorized'});
            } else {
                Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                    .then(() => res.sendStatus(200).json({message : 'Product successfully modified'}))
                    .catch(error => res.sendStatus(401).json({ error }));
            }
        })
        .catch((error) => {
            res.sendStatus(400).json({ error });
        });
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId !== req.auth.userId) {
                res.sendStatus(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => { res.sendStatus(200).json({message: 'Product successfully deleted'})})
                        .catch(error => res.sendStatus(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.sendStatus(500).json({ error });
        });
};

//Смотрите все опубликованные продукты на главной странице
exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.sendStatus(200).json(things);
        }
    ).catch(
        (error) => {
            res.sendStatus(400).json({
                error
            });
        }
    );
};