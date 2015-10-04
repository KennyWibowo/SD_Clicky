var symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8",
    "9", "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v,", "w",
    "x", "y", "z"
]

var classes = {
    1: {
        "name": "Biology",
        "teacher": "Ms.Smith",
        "pupils": ["Swashbuckler"],
        "lectures": [{
            "pass": "123abcd",
            "questions": [{
                "questionName": "Swole",
                "question": "How do you get swole?",
                "a": {
                    "answer": "Be Siraj",
                    "studentsAnswered": {}
                },
                "b": {
                    "answer": "Be Joe",
                    "studentsAnswered": {}
                },
                "c": {
                    "answer": "Be Siraj",
                    "studentsAnswered": {}
                },
                "d": {
                    "answer": "Be Siraj",
                    "studentsAnswered": {}
                },
                "e": {
                    "answer": "Be Siraj",
                    "studentsAnswered": {}
                },
                "correct": "b"
            }, {
                "questionName": "FavFood",
                "question": "What's your favorite food?",
                "a": {
                    "answer": "Siraj 's breakfast burrito",
                    "studentAnswered": {}
                },
                "b": {
                    "answer": "Gyudon",
                    "studentAnswered": {}
                },
                "c": {
                    "answer": "Lil Dipper ice cream",
                    "studentAnswered": {}
                },
                "d": {
                    "answer": "Milk",
                    "studentAnswered": {}
                },
                "e": {
                    "answer": "Sushi",
                    "studentAnswered": {}
                },
                "correct": "a"
            }]
        }, {
            "pass": "456efgh",
            "questions": [{
                "questionName": "OddOneOut",
                "question": "What food was not present at SDHacks?",
                "a": {
                    "answer": "Pizza",
                    "studentAnswered": {"Bob": true, "Joe": true, "Rich": true, "Ken": true, "Dan": true}
                },
                "b": {
                    "answer": "Boba",
                    "studentAnswered": {"May": true, "Misty": true, "Dawn": true}
                },
                "c": {
                    "answer": "Spaghetti",
                    "studentAnswered": {"Brock": true}
                },
                "d": {
                    "answer": "Sun Chips",
                    "studentAnswered": {}
                },
                "e": {
                    "answer": "Apples",
                    "studentAnswered": {}
                },
                "correct": "e"
            }]
        }]
    }
}

var nextClassNumber = 2;
var randomGenerator = function(passLength) {

    var classPass = "";

    for (var i = 0; i < passLength; i++) {
        classPass += symbols[Math.rand() * 36];
    }

    return classPass;

}

module.exports = {
    createClass: function(name, teacher) {
        classes[nextClassNumber] = {
            "name": name,
            "teacher": teacher.name,
            "lectures": []
        }

        teacher.classes.push(nextClassNumber);

        nextClassNumber++;
    },
    getClass: function(classID) {
        return classes[classID];
    },
    getAllClasses: function() {
        return classes;
    },
    getQuestion: function(questionName) {
        for (var key1 in classes) {
            var thisclass = classes[key1];
            for (var key2 in thisclass.lectures) {
                var lecture = thisclass.lectures[key2];
                for (var key3 in lecture.questions) {
                    var question = lecture.questions[key3];
                    if (question.questionName == questionName)
                        return question;
                }
            }
        }

        return null;
    },
    lectureCreate: function(classID, lectureName, lectureTime) {
        if (!classes[classID]) {
            var error = new Error("Pick one of the classes you've already created");
            return callback(error);
        }
        classes[className].lectures.push({
            "questions": [],
            "pass": randomGenerator(8)
        });
    },
    questionAdd: function(user, className, lectureNumber, questionName, question, a, b, c, d, e, answer) {
        if (!classes[classID]) {
            var error = new Error("Pick one of the classes you've already created");
            return callback(error);
        }
        if (!classes[classID].lectures[lectureNumber]) {
            var error = new Error("Pick one of the lectures you've already created");
            return callback(error);
        }
        classes[classID].lectures[lectureNumber].questions.push({
            "questionName": questionName,
            "question": question,
            "a": a,
            "b": b,
            "c": c,
            "d": d,
            "e": e,
            "correct": answer
        });
    },
    createGraphData: function(questionName) {
        var currQ;

        for (var key1 in classes) {
            var thisclass = classes[key1];
            for (var key2 in thisclass.lectures) {
                var lecture = thisclass.lectures[key2];
                for (var key3 in lecture.questions) {
                    var question = lecture.questions[key3];
                    if (question.questionName == questionName) {
                        currQ = question;
                        break;
                    }
                }
            }
        }
        var toRet = [
            countingTrueKeys(currQ.a.studentAnswered), 

            countingTrueKeys(currQ.b.studentAnswered),

            countingTrueKeys(currQ.c.studentAnswered),

            countingTrueKeys(currQ.d.studentAnswered),

            countingTrueKeys(currQ.e.studentAnswered)
        ];

        console.dir(toRet);

        return toRet;
    }
}

var countingTrueKeys = function(answers) {
    var count = 0
    for (var key1 in answers) {

        var bolval = answers[key1];
        if (bolval == true) {
            count++;
        }
    }

    return count;
}