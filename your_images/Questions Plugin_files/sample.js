/**
 * This script aims simply to use the Questions plugin
 */

// This variable is going to contain the questions of the your course
var EVALUATION_FORM_SELECTOR = "#evaluationForm";

var DEFAULT_LBL_BTN_TRY_AGAIN = "Try again";
var DEFAULT_LBL_BTN_SUBMIT_ANSWER = "Submit answer";

var course = {
    name: "Course Name",
    units: [
        {
            unitName: "Unit Name",
            unitId: 1,
            unitQuestions: [
                {
                    questionId: 0,
                    type: "multipleAnswersTrueFalse",
                    questionStatusImg: "",
                    enunciate: "Select T for the alternatives that are correct or F for the alternatives that are incorrect:",
                    alternatives: [
                        {
                            id: 0,
                            isDisplayingTip: false,
                            isTrue: true,
                            alternativeText: "This is afirmative is True",
                            alternativeHint: "This alternative is true because of the factors x, y, z",
                            hintClass: "success"
                        },
                        {
                            id: 1,
                            isDisplayingTip: false,
                            isTrue: false,
                            alternativeText: "This is afirmative is False",
                            alternativeHint: "This alternative is false because of the factors x, y, z",
                            hintClass: "warning"
                        },
                        {
                            id: 2,
                            isDisplayingTip: false,
                            isTrue: true,
                            alternativeText: "This is afirmative is True",
                            alternativeHint: "This alternative is true because of the factors x, y, z",
                            hintClass: "success"
                        },
                        {
                            id: 3,
                            isDisplayingTip: false,
                            isTrue: true,
                            alternativeText: "This is afirmative is True",
                            alternativeHint: "This alternative is true because of the factors x, y, z",
                            hintClass: "success"
                        },
                        {
                            id: 4,
                            isDisplayingTip: false,
                            isTrue: false,
                            alternativeText: "This is afirmative is False",
                            alternativeHint: "This alternative is false because of the factors x, y, z",
                            hintClass: "warning"
                        }
                    ]
                },
                {
                    questionId: 1,
                    type: "singleAnswer",
                    enunciate: "Analyze the alternatives and pick the correct ones: ",
                    rightAlternativeId: 1,
                    questionStatusImg: "",
                    staticAlternatives: [
                        {
                            id: 0,
                            position: 1,
                            alternativeText: "Afirmative x about a topic."
                        },
                        {
                            id: 1,
                            position: 2,
                            alternativeText: "Afirmative y about a topic."
                        },
                        {
                            id: 2,
                            position: 3,
                            alternativeText: "Afirmative z about a topic."
                        },
                        {
                            id: 3,
                            position: 4,
                            alternativeText: "Correct afirmative."
                        },
                        {
                            id: 4,
                            position: 5,
                            alternativeText: "Correct afirmative."
                        }
                    ],
                    alternatives: [
                        {
                            id: 0,
                            isDisplayingTip: false,
                            alternativeText: "I e II",
                            alternativeHint: "Afirmative I is false because of the factors x, y, z",
                            hintClass: "warning"
                        },
                        {
                            id: 1,
                            isDisplayingTip: false,
                            alternativeText: "IV e V",
                            alternativeHint: "Congrats! You're right!",
                            hintClass: "success"
                        },
                        {
                            id: 2,
                            isDisplayingTip: false,
                            alternativeText: "I e III",
                            alternativeHint: "It is incorrect to say that the alternatives I and III are correct, because of the factors x, y, z",
                            hintClass: "warning"
                        },
                        {
                            id: 3,
                            isDisplayingTip: false,
                            alternativeText: "II e IV",
                            alternativeHint: "It is incorrect to say that the alternatives II and IV are correct, because of the factors x, y, z",
                            hintClass: "warning"
                        },
                        {
                            id: 4,
                            isDisplayingTip: false,
                            alternativeText: "II e V",
                            alternativeHint: "No no, the alternative II is incorrect.",
                            hintClass: "warning"
                        }
                    ]
                },
                {
                    questionId: 2,
                    type: "singleAnswer",
                    enunciate: "Select the incorrect alternative:",
                    rightAlternativeId: 2,
                    questionStatusImg: "",
                    alternatives: [
                        {
                            id: 0,
                            isDisplayingTip: false,
                            alternativeText: "Correct alternative.",
                            alternativeHint: "This alternative is right, check the other ones",
                            hintClass: "warning"
                        },
                        {
                            id: 1,
                            isDisplayingTip: false,
                            alternativeText: "Correct alternative.",
                            alternativeHint: "This alternative is right, check the other ones",
                            hintClass: "warning"
                        },
                        {
                            id: 2,
                            isDisplayingTip: false,
                            alternativeText: "Incorrect alternative.",
                            alternativeHint: "Congrats!, this is the only alternative that is incorrect.",
                            hintClass: "success"
                        },
                        {
                            id: 3,
                            isDisplayingTip: false,
                            alternativeText: "Correct alternative.",
                            alternativeHint: "This alternative is right, check the other ones",
                            hintClass: "warning"
                        },
                        {
                            id: 4,
                            isDisplayingTip: false,
                            alternativeText: "Correct alternative.",
                            alternativeHint: "This alternative is right, check the other ones",
                            hintClass: "warning"
                        }
                    ]
                }
            ]
        }
    ]
};

/**
 * Initialize the apge
 */
$(document).ready(function () {
    buildEvaluationForm();
});

function buildEvaluationForm() {
    var Questions = jQuery.extend({}, new Question());
    var unit1 = course.units[0];

    var question1Obj = jQuery.extend({}, new TrueOrFalseQuestion());
    var question1Model = unit1.unitQuestions[0];
    var modelQuestion1 = {
        btnTryAgainText: DEFAULT_LBL_BTN_TRY_AGAIN,
        btnSubmitText: DEFAULT_LBL_BTN_SUBMIT_ANSWER,
        lang:"en",
        unitId: unit1.unitId,
        questionId: question1Model.questionId,
        unitNumber: unit1.unitId,
        questionNumber: 1,
        questionStatusImg: question1Model.questionStatusImg,
        enunciate: question1Model.enunciate,
        alternatives: question1Model.alternatives
    }
    question1Obj.build(EVALUATION_FORM_SELECTOR, modelQuestion1, onQuestionAlternativeSelected);

    var question2Obj = jQuery.extend({}, new SingleAnswerQuestion());
    var question2Model = unit1.unitQuestions[1];
    question2Model.staticAlternatives = Questions.addRomanAlgarismsForAlternatives(question2Model.staticAlternatives);
    var modelQuestion2 = {
        btnTryAgainText: DEFAULT_LBL_BTN_TRY_AGAIN,
        btnSubmitText: DEFAULT_LBL_BTN_SUBMIT_ANSWER,
        lang:"en",
        unitId: unit1.unitId,
        questionId: question2Model.questionId,
        unitNumber: unit1.unitId,
        questionNumber: 2,
        questionStatusImg: question2Model.questionStatusImg,
        enunciate: question2Model.enunciate,
        rightAlternative: question2Model.rightAlternativeId,
        alternatives: question2Model.alternatives,
        staticAlternatives: question2Model.staticAlternatives,
        hasStaticAlternatives: true
    }
    question2Obj.build(EVALUATION_FORM_SELECTOR, modelQuestion2, onQuestionAlternativeSelected);

    var question3Obj = jQuery.extend({}, new SingleAnswerQuestion());
    var question3Model = unit1.unitQuestions[2];
    question3Model.alternatives = Questions.getAlphabetLetterForAlternatives(question3Model.alternatives, true);
    var modelQuestion3 = {
        btnTryAgainText: DEFAULT_LBL_BTN_TRY_AGAIN,
        btnSubmitText: DEFAULT_LBL_BTN_SUBMIT_ANSWER,
        lang:"en",
        unitId: unit1.unitId,
        questionId: question3Model.questionId,
        unitNumber: unit1.unitId,
        questionNumber: 3,
        questionStatusImg: question3Model.questionStatusImg,
        enunciate: question3Model.enunciate,
        rightAlternative: question3Model.rightAlternativeId,
        alternatives: question3Model.alternatives,
        hasStaticAlternatives: false
    }
    question3Obj.build(EVALUATION_FORM_SELECTOR, modelQuestion3, onQuestionAlternativeSelected);
}

function onQuestionAlternativeSelected(unitId, questionId, questionStatus){
    console.log("The user has changed the status of a Question object: ");
    console.log("Unit id: " + unitId);
    console.log("Question id: " + questionId);
    console.log("Question status: " + questionStatus);
    console.log("---------------------------------------------------");
}
