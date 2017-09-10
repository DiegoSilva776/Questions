/**
 * question.js handles the actions of the component Question, which is an object 
 * that can be used within an evaluation form, to display a question and gather the
 * user answer.
 * 
 * @author Diego M. Silva - (diegomsilva.com)
 * @copyright Diego M. Silva
 * @version 0.0.1
 * @requires jQuery
 * @requires Mustache
 * @license MIT
 */

function Question() {
  this._initialized = false;
};

Question.prototype = {

  PREFIX_ID_QUESTION: "#question_",
  PREFIX_ID_ALTERNATIVE: "#alternative_",
  ID_JOINER: "_",

  SELECTOR_ALTERNATIVES: " .body .alternative",
  SELECTOR_ALTERNATIVE_HINT: " .alternative-hint",
  SELECTOR_ALTERNATIVE_RADIO_BTN: " .body .alternative .selector.radio input",
  SELECTOR_ALTERNATIVE_RADIO_BTN_LEFT_TF: " .body .alternative .selector .left input",
  SELECTOR_ALTERNATIVE_RADIO_BTN_RIGHT_TF: " .body .alternative .selector .right input",
  SELECTOR_TRY_AGAIN_BTN: " .question-toolbox .try-again",
  SELECTOR_SUBMIT_BTN: " .question-toolbox .submit",
  SELECTOR_SUCCESFUL_ANSWER: " h3 span",
  SELECTOR_IMG_QUESTION_STATUS: " h3 span img",
  SELECTOR_ALTERNATIVE_SELECTOR: " .alternative .selector",
  SELECTOR_ALTERNATIVE_TRUE_INPUT: " .left input",
  SELECTOR_ALTERNATIVE_FALSE_INPUT: " .right input",
  SELECTOR_CHECKBOX_INPUT: " .checkbox input",
  SELECTOR_QUESTIONS_SINGLE_ANSWER: " .single-answer",
  SELECTOR_QUESTIONS_SINGLE_ANSWER_GROUPING: " .single-answer-grouping",
  SELECTOR_QUESTIONS_TF: " .tf",
  SELECTOR_QUESTION_MESSAGE: " .question-message",

  CLASS_HIDDEN: "hidden",
  CLASS_ALTERNATIVE: "alternative",
  CLASS_ERROR: "error",
  CLASS_WARNING: "warning",
  CLASS_SUCCESS: "success",

  T_OR_F: {
    T: "t",
    F: "f",
  },

  QUESTION_STATUS: {
    WRONG: "wrong",
    ANSWERING: "answering",
    RIGHT: "right",
    CLEAR: ""
  },

  QUESTION_IMAGES: {
    ICO_PNG_WRONG: "questions/images/ico_wrong_answer.png",
    ICO_PNG_ANSWERING: "questions/images/ico_answering_answer.png",
    ICO_PNG_SUCCESS: "questions/images/ico_rigth_answer.png",
  },

  ALPHABET : "abcdefghijklmnopqrstuvwxyz".split(''),

  getQuestionIdSelector: function (unitNumber, questionNumber) {
    return this.PREFIX_ID_QUESTION + unitNumber + this.ID_JOINER + questionNumber;
  },

  getAlternativeInput: function (target, unitNumber, questionNumber, alternative) {
    return $(target + " " + this.PREFIX_ID_ALTERNATIVE + unitNumber + this.ID_JOINER + questionNumber + this.ID_JOINER + alternative + " input");
  },

  getAlternative: function (target, unitNumber, questionNumber, alternative) {
    try {
      return $(target + " " + this.PREFIX_ID_ALTERNATIVE + unitNumber + this.ID_JOINER + questionNumber + this.ID_JOINER + alternative)[0];
    } catch (err) {
      return undefined;
    }
  },

  romanize: function(num) {
    if (!+num)
        return false;

    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;

    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;

    return roman;
  },

  addRomanAlgarismsForAlternatives: function(listAlternatives) {
    try {
      
      for (var i = 0; i < listAlternatives.length; i++) {
        listAlternatives[i].romanRepresentation = this.romanize(listAlternatives[i].position);
      }
  
      return listAlternatives;

    } catch(err) {
      console.log("Failed to convert number into Roman algarism " + err);
    }

    return listAlternatives;
  },

  getAlphabetLetterForAlternatives: function(listAlternatives, upperCase) {
    try {
      
      for (var i = 0; i < listAlternatives.length; i++) {

        if (upperCase) {
          listAlternatives[i].alternativeLetter = this.ALPHABET[i].toUpperCase();
        } else {
          listAlternatives[i].alternativeLetter = this.ALPHABET[i];
        }
      }
  
      return listAlternatives;

    } catch(err) {
      console.log("Failed to convert number into Roman algarism " + err);
    }

    return listAlternatives;
  }

}

/**
 * Uses the attributes and functions of the Question class, via 'SingleAnswerQuestion.base' attribute.
 * The SingleAnswerQuestion allows the selection of only one right alternative for the question.
 * 
 * A sample of the expected data model for a SingleAnswerQuestion object is:
   model: {
      btnTryAgainText: "Tentar de novo",
      btnSubmitText: "Enviar Resposta",
      lang: "",
      unitId: -1,
      questionId: -1,
      unitNumber: -1,
      questionNumber: -1,
      enunciate: "",
      rightAlternative: -1,
      questionStatusImg: "",
      questionErrorMsg: "",
      alternatives: [
         {
            alternativeText: "",
            alternativeHint: "",
            hintClass: ""
         }
      ],
      staticAlternatives: [
         {
            id: 0,
            position: 1,
            numericalRepresentation: "",
            alternativeText: "10 - 5"
         }
      ]
   },
 */
function SingleAnswerQuestion() {
  this._initialized = false;
};

SingleAnswerQuestion.prototype = {

  base: jQuery.extend({}, new Question()),
  model: {},
  target: undefined,
  gotItRight: false,
  selectedAlternativeId: -1,
  callback: undefined,

  /**
   * Getters and Setters
   */
  setModel: function (model) {
    this.model = model;
  },

  getModel: function () {
    return this.model;
  },

  setTarget: function (target) {
    this.target = target;
  },

  getTarget: function () {
    return this.target;
  },

  setUserGotItRight: function (gotItRight) {
    this.gotItRight = gotItRight;
  },

  userGotItRight: function () {
    return this.gotItRight;
  },

  setSelectedAlternativeId: function (alternativeId) {
    this.selectedAlternativeId = alternativeId;
  },

  getSelectedAlternativeId: function () {
    return this.selectedAlternativeId;
  },

  setCallback: function(callbackFunction) {
    this.callback = callbackFunction;
  }, 

  getCallback: function() {
    return this.callback;
  }, 

  getTemplate: function () {
    return '<div id="question_{{unitNumber}}_{{questionNumber}}" class="question">' +
      '{{#questionStatusImg}}' +
      '<h4 class="heading-3"><span><img src="{{questionStatusImg}}"></span><b>Question {{questionNumber}}</b></h4>' +
      '{{/questionStatusImg}}' +
      '{{^questionStatusImg}}' +
      '<h4 class="heading-3"><span class="hidden"><img src="{{questionStatusImg}}"></span><b>Question {{questionNumber}}</b></h4>' +
      '{{/questionStatusImg}}' +
      '<div class="header">' +
      '<div class="enunciate">' +
      '<p class="heading-3">{{enunciate}}</p>' +
      '</div>' +
      '</div>' +
      '<div class="body">' +
      '{{#hasStaticAlternatives}}' +
      '<div class="static-alternatives">' +
      '{{#staticAlternatives}}' +
      '<div class="label-container">' +
      '<b><span>{{romanRepresentation}}</span></b> {{alternativeText}}' +
      '</div>' +
      '{{/staticAlternatives}}' +
      '</div>' +
      '{{/hasStaticAlternatives}}' +
      '{{^hasStaticAlternatives}}' +
      '{{/hasStaticAlternatives}}' +
      '{{#alternatives}}' +
      '<div id="alternative_{{unitNumber}}_{{questionNumber}}_{{id}}" class="alternative">' +
      '<div class="selector radio">' +
      '<input type="radio" name="optradio_{{questionNumber}}">' +
      '</div>' +
      '<div class="text">' +
      '<div class="alternative-text">' +
      '{{#hasStaticAlternatives}}' +
      '{{alternativeText}}' +
      '{{/hasStaticAlternatives}}' +
      '{{^hasStaticAlternatives}}' +
      '<b><span>{{alternativeLetter}}</span></b> {{alternativeText}}' +  
      '{{/hasStaticAlternatives}}' +
      '</div>' +
      '<div class="alternative-hint {{hintClass}} hidden">' +
      '{{alternativeHint}}' +
      '</div>' +
      '</div>' +
      '</div>' +
      '{{/alternatives}}' +
      '</div>' +
      '<div class="question-toolbox">' +
      '<a class="btn btn-default try-again">{{btnTryAgainText}}</a>' +
      '<a class="btn btn-primary submit">{{btnSubmitText}}</a>' +
      '</div>' +
      '</div>';
  },

  submitQuestion: function () {
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    // Process the result
    if (this.getSelectedAlternativeId() == this.getModel().rightAlternative) {
      this.setUserGotItRight(true);
    } else {
      var selectedAlternative = this.base.getAlternative(this.getTarget(), this.getModel().unitNumber, this.getModel().questionNumber, this.getSelectedAlternativeId());

      if (selectedAlternative !== undefined) {
        $(selectedAlternative).find(this.base.SELECTOR_ALTERNATIVE_HINT).removeClass(this.base.CLASS_WARNING);
        $(selectedAlternative).find(this.base.SELECTOR_ALTERNATIVE_HINT).addClass(this.base.CLASS_ERROR);
      }
    }

    // Reveal the hint message of the question
    if (!this.userGotItRight()) {
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_WRONG);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.WRONG, true);
    } else {
      $(questionIdSelector + this.base.SELECTOR_TRY_AGAIN_BTN).css("opacity", "0.5");
      $(questionIdSelector + this.base.SELECTOR_SUBMIT_BTN).css("opacity", "0.5");
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_SUCCESS);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.RIGHT, true);
    }

    // Reveal the hint message of the alternative
    if (this.getSelectedAlternativeId() !== -1) {
      var selectedAlternative = this.base.getAlternative(
        this.getTarget(),
        this.getModel().unitNumber,
        this.getModel().questionNumber,
        this.getSelectedAlternativeId());

      if (selectedAlternative !== undefined) {
        $(selectedAlternative).find(this.base.SELECTOR_ALTERNATIVE_HINT).removeClass(this.base.CLASS_HIDDEN);
      }
    }
  },

  validateSelectedAlternative: function (selectedAlternative) {
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    try {
      // Update the image that represents the status of the question
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_ANSWERING);
      $(questionIdSelector + this.base.SELECTOR_SUCCESFUL_ANSWER).removeClass(this.base.CLASS_HIDDEN);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.ANSWERING);

      var firstParent = $(selectedAlternative).parent();
      var secondParent = $(selectedAlternative).parent().parent();
      var idParts = [];

      if ($(firstParent).hasClass(this.base.CLASS_ALTERNATIVE)) {
        idParts = $(firstParent).attr("id").split("_");
      } else {
        idParts = $(secondParent).attr("id").split("_");
      }

      this.setSelectedAlternativeId(Number(idParts[3]));
    } catch (err) {
      console.log("Failed to validate selected option " + err);
    }
  },

  resetQuestionStatus: function (questionIdSelector) {
    $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', "");

    // Update the question status
    this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.CLEAR);
  },

  hideHints: function () {
    try {
      var ctx = this;
      var questionIdSelector = ctx.base.getQuestionIdSelector(ctx.getModel().unitNumber, ctx.getModel().questionNumber);
      var alternativesHints = $(questionIdSelector + ctx.base.SELECTOR_ALTERNATIVE_HINT);
      
      $(alternativesHints).each(function () {
        if (!$(this).hasClass(ctx.base.CLASS_HIDDEN)) {
          $(this).addClass(ctx.base.CLASS_HIDDEN);
        }
      });

    } catch (err) {
      console.log("Failed to reset the alternative hints " + err);
    }
  },

  ensureSelectionRightAlternative: function() {
    this.base.getAlternativeInput(this.getTarget(), this.getModel().unitNumber, this.getModel().questionNumber, this.getModel().rightAlternative).prop('checked', true);
  },

  onRadioBtnClick: function (obj) {
    if (!this.userGotItRight()) {
      this.hideHints();
      this.validateSelectedAlternative($(obj));
    } else {
      this.ensureSelectionRightAlternative();
    }
  },

  initEvents: function () {
    var ctx = this;
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_RADIO_BTN).on("click", function () {
      ctx.onRadioBtnClick($(this));
    });

    $(questionIdSelector + this.base.SELECTOR_SUBMIT_BTN).on("click", function () {
      ctx.submitQuestion();
    });

    $(questionIdSelector + this.base.SELECTOR_TRY_AGAIN_BTN).on("click", function () {
      if (!ctx.userGotItRight()) {
        ctx.resetQuestionStatus(questionIdSelector);
        ctx.hideHints();
      }
    });
  },

  verifyStateForAnsweredQuestion : function() {
    try {
      var ctx = this;
      var questionIdSelector = ctx.base.getQuestionIdSelector(ctx.getModel().unitNumber, ctx.getModel().questionNumber);
      var alternativesHints = $(questionIdSelector + ctx.base.SELECTOR_ALTERNATIVE_HINT);

      if (ctx.getModel().questionStatusImg === ctx.base.QUESTION_IMAGES.ICO_PNG_SUCCESS || ctx.getModel().questionStatusImg === ctx.base.QUESTION_IMAGES.ICO_PNG_SUCCESS) {
        ctx.setUserGotItRight(true);
        var rightAlternative = $(alternativesHints)[ctx.getModel().rightAlternative]

        $(rightAlternative).removeClass(this.base.CLASS_HIDDEN);

        $(questionIdSelector + ctx.base.SELECTOR_TRY_AGAIN_BTN).css("opacity", "0.5");
        $(questionIdSelector + ctx.base.SELECTOR_SUBMIT_BTN).css("opacity", "0.5");
        $(questionIdSelector + ctx.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', ctx.base.QUESTION_IMAGES.ICO_PNG_SUCCESS);

        ctx.ensureSelectionRightAlternative();
      }
    } catch (err) {
      console.log("Failed to verify the initial state of the question " + err);
    }
  },

  build: function (tgt, model, callback) {
    this.setTarget(tgt);

    if (model != undefined) {
      this.setModel(model);
      this.setCallback(callback);
      var template = this.getTemplate();
      var questionHtml = Mustache.to_html(template, this.getModel());

      $(this.getTarget()).append(questionHtml);
      this.initEvents();
      this.verifyStateForAnsweredQuestion();
    }
  }

};

/**
 * The class TrueOrFalseQuestion allows a combination of correct answers for each alternative, 
 * in order to generate the correct answer of the question.
 * 
 * A sample of the expected data model for a TrueOrFalseQuestion object is:
   model: {
      btnTryAgainText: "Tentar de novo",
      btnSubmitText: "Enviar Resposta",
      lang: "",
      unitId: -1,
      questionId: -1,
      unitNumber: -1,
      questionNumber: -1,
      enunciate: "",
      rightAlternative: -1,
      questionErrorMsg: "",
      alternatives: [
         {
            isTrue: false,
            id: 0,
            alternativeText: "",
            alternativeHint: "",
            hintClass: ""
         }
      ]
   }
*/
function TrueOrFalseQuestion() {
  this._initialized = false;
};

TrueOrFalseQuestion.prototype = {

  base: jQuery.extend({}, new Question()),
  model: {},
  target: undefined,
  gotItRight: false,
  selectedAlternativeId: -1,
  selectedAlternatives: {},
  callback: undefined,

  /**
   * Getters and Setters
   */
  setModel: function (model) {
    this.model = model;
  },

  getModel: function () {
    return this.model;
  },

  setTarget: function (target) {
    this.target = target;
  },

  getTarget: function () {
    return this.target;
  },

  setUserGotItRight: function (gotItRight) {
    this.gotItRight = gotItRight;
  },

  userGotItRight: function () {
    return this.gotItRight;
  },

  setSelectedAlternativeId: function (alternativeId) {
    this.selectedAlternativeId = alternativeId;
  },

  getSelectedAlternativeId: function () {
    return this.selectedAlternativeId;
  },

  // Getters and Setters
  setSelectedAlternatives: function (alternatives) {
    this.selectedAlternatives = alternatives;
  },

  getSelectedAlternatives: function () {
    return this.selectedAlternatives;
  },

  setCallback: function(callbackFunction) {
    this.callback = callbackFunction;
  }, 

  getCallback: function() {
    return this.callback;
  }, 

  // Other methods
  getTemplate: function () {
    return '<div id="question_{{unitNumber}}_{{questionNumber}}" class="question tf">' +
      '{{#questionStatusImg}}' +
      '<h4 class="heading-3"><span><img src="{{questionStatusImg}}"></span><b>Question {{questionNumber}}</b></h4>' +
      '{{/questionStatusImg}}' +
      '{{^questionStatusImg}}' +
      '<h4 class="heading-3"><span class="hidden"><img src="{{questionStatusImg}}"></span><b>Question {{questionNumber}}</b></h4>' +
      '{{/questionStatusImg}}' +
      '<div class="header">' +
      '<div class="selector-label">' +
      '<span class="left">{{trueAlternativeSelectorLabel}}</span> <b>|</b> <span class="right">{{falseAlternativeSelectorLabel}}</span>' +
      '</div>' +
      '<div class="enunciate">' +
      '<p class="heading-3">{{enunciate}}</p>' +
      '</div>' +
      '</div>' +
      '<div class="body">' +
      '{{#alternatives}}' +
      '<div id="alternative_{{unitNumber}}_{{questionNumber}}_{{id}}" class="alternative">' +
      '<div class="selector">' +
      '<div class="radio left t">' +
      '<input type="radio" name="optradio_{{id}}_{{questionNumber}}"> <small>{{trueAlternativeSelectorLabel}}</small>' +
      '</div>' +
      '<div class="radio right f">' +
      '<input type="radio" name="optradio_{{id}}_{{questionNumber}}"> <small>{{falseAlternativeSelectorLabel}}</small>' +
      '</div>' +
      '</div>' +
      '<div class="text">' +
      '<div class="alternative-text">' +
      '{{alternativeText}}' +
      '</div>' +
      '<div class="alternative-hint {{hintClass}} hidden">' +
      '{{alternativeHint}}' +
      '</div>' +
      '</div>' +
      '</div>' +
      '{{/alternatives}}' +
      '</div>' +
      '<div class="question-toolbox">' +
      '<a class="btn btn-default try-again">{{btnTryAgainText}}</a>' +
      '<a class="btn btn-primary submit">{{btnSubmitText}}</a>' +
      '</div>' +
      '</div>';
  },

  validateFinalAnswer: function () {
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    // Validate all alternatives that were answered so far
    this.setUserGotItRight(true);

    for (var i = 0; i < this.getModel().alternatives.length; i++) {
      var alternativeView = $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_HINT)[i];
      var alternative = this.getModel().alternatives[i];
      var selectedAlternativeOption = this.getSelectedAlternatives()[i];

      if (alternative != undefined && selectedAlternativeOption != undefined) {

        if (alternative.isTrue && selectedAlternativeOption === this.base.T_OR_F.T) {
          $(alternativeView).removeClass(this.base.CLASS_ERROR);
          $(alternativeView).removeClass(this.base.CLASS_WARNING);
          $(alternativeView).addClass(this.base.CLASS_SUCCESS);

        } else if (!alternative.isTrue && selectedAlternativeOption === this.base.T_OR_F.F) {
          $(alternativeView).removeClass(this.base.CLASS_ERROR);
          $(alternativeView).removeClass(this.base.CLASS_WARNING);
          $(alternativeView).addClass(this.base.CLASS_SUCCESS);

        } else {
          $(alternativeView).removeClass(this.base.CLASS_ERROR);
          $(alternativeView).removeClass(this.base.CLASS_SUCCESS);
          $(alternativeView).addClass(this.base.CLASS_ERROR);

          this.setUserGotItRight(false);
        }

        $(alternativeView).removeClass(this.base.CLASS_HIDDEN);
      } else {
        this.setUserGotItRight(false);
      }
    }
  },

  submitQuestionTrueFalse: function () {
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    this.validateFinalAnswer();

    if (!this.userGotItRight()) {
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_WRONG);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.WRONG, true);
      
    } else {
      $(questionIdSelector + this.base.SELECTOR_TRY_AGAIN_BTN).css("opacity", "0.5");
      $(questionIdSelector + this.base.SELECTOR_SUBMIT_BTN).css("opacity", "0.5");
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_SUCCESS);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.RIGHT, true);
    }
  },

  validateSelectedAlternative: function (selectedAlternative) {
    try {
      // Get the selected alternative and option within the alternative
      var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

      // Update the image that represents the status of the question
      $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', this.base.QUESTION_IMAGES.ICO_PNG_ANSWERING);
      $(questionIdSelector + this.base.SELECTOR_SUCCESFUL_ANSWER).removeClass(this.base.CLASS_HIDDEN);

      // Update the question status
      this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.ANSWERING);

      var selectedQuestion = -1;
      var selectedQuestionChoice = "";
      var alternative = $(selectedAlternative).parent().parent().parent();
      var idParts = [];

      if ($(alternative).hasClass(this.base.CLASS_ALTERNATIVE)) {
        idParts = $(alternative).attr("id").split("_");
      }

      selectedQuestion = Number(idParts[3]);

      if ($(selectedAlternative).parent().hasClass(this.base.T_OR_F.T)) {
        selectedQuestionChoice = this.base.T_OR_F.T;
      } else {
        selectedQuestionChoice = this.base.T_OR_F.F;
      }

      this.getSelectedAlternatives()[selectedQuestion] = selectedQuestionChoice;
    } catch (err) {
      console.log("Failed to validate selected option " + err);
    }
  },

  resetQuestionStatus: function (questionIdSelector) {
    $(questionIdSelector + this.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', "");

    // Update the question status
    this.getCallback()(this.getModel().unitId, this.getModel().questionId, this.base.QUESTION_STATUS.CLEAR);
  },

  ensureSelectionRightAnswer: function () {
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    for (var i = 0; i < this.getModel().alternatives.length; i++) {
      var alternativeSelectorView = $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_SELECTOR)[i];
      var selectedAlternativeOption = this.getSelectedAlternatives()[i];

      if (selectedAlternativeOption != undefined) {

        if (selectedAlternativeOption == this.base.T_OR_F.T) {
          $(alternativeSelectorView).find(this.base.SELECTOR_ALTERNATIVE_TRUE_INPUT).prop('checked', true);

        } else if (selectedAlternativeOption == this.base.T_OR_F.F) {
          $(alternativeSelectorView).find(this.base.SELECTOR_ALTERNATIVE_FALSE_INPUT).prop('checked', true);
        }
      }
    }
  },

  hideHints: function () {
    var ctx = this;
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);
    var alternativesHints = $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_HINT);
    
    try {
      $(alternativesHints).each(function () {
        if (!$(this).hasClass(ctx.base.CLASS_HIDDEN)) {
          $(this).addClass(ctx.base.CLASS_HIDDEN);
        }
      });

    } catch (err) {
      console.log("Failed to reset the alternative hints");
    }
  },

  hideWrongHints: function () {
    var ctx = this;
    var questionIdSelector = ctx.base.getQuestionIdSelector(ctx.getModel().unitNumber, ctx.getModel().questionNumber);
    var alternativesHints = $(questionIdSelector + ctx.base.SELECTOR_ALTERNATIVE_HINT);
  
    try {
      $(alternativesHints).each(function () {
        
        if (!$(this).hasClass(ctx.base.CLASS_HIDDEN) && $(this).hasClass(ctx.base.CLASS_WARNING)) {
          $(this).addClass(ctx.base.CLASS_HIDDEN);
        }
      });

    } catch (err) {
      console.log("Failed to reset the alternative hints");
    }
  },

  onClickAlternative: function (obj) {
    if (!this.userGotItRight()) {
      this.hideWrongHints();
      this.validateSelectedAlternative($(obj));
    } else {
      this.ensureSelectionRightAnswer();
    }
  },

  initEvents: function () {
    var ctx = this;
    var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);

    $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_RADIO_BTN_LEFT_TF).on("click", function () {
      ctx.onClickAlternative($(this));
    });

    $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_RADIO_BTN_RIGHT_TF).on("click", function () {
      ctx.onClickAlternative($(this));
    });

    $(questionIdSelector + this.base.SELECTOR_SUBMIT_BTN).on("click", function () {
      if (!ctx.userGotItRight()) {
        ctx.submitQuestionTrueFalse();
      }
    });

    $(questionIdSelector + this.base.SELECTOR_TRY_AGAIN_BTN).on("click", function () {
      if (!ctx.userGotItRight()) {
        ctx.resetQuestionStatus(questionIdSelector);
        ctx.hideHints();
      }
    });
  },

  verifyStateForAnsweredQuestion : function() {
    try {
      var ctx = this;
      var questionIdSelector = this.base.getQuestionIdSelector(this.getModel().unitNumber, this.getModel().questionNumber);
      
      if (this.getModel().questionStatusImg === this.base.QUESTION_IMAGES.ICO_PNG_ANSWERING) {
        this.setUserGotItRight(true);
        this.ensureSelectionRightAnswer();
        
        var alternativesHints = $(questionIdSelector + this.base.SELECTOR_ALTERNATIVE_HINT);
    
        try {
          $(alternativesHints).each(function () {
            
            if ($(this).hasClass(ctx.base.CLASS_HIDDEN) && $(this).hasClass(ctx.base.CLASS_SUCCESS)) {
              $(this).removeClass(ctx.base.CLASS_HIDDEN);
            }
          });
    
          $(questionIdSelector + ctx.base.SELECTOR_TRY_AGAIN_BTN).css("opacity", "0.5");
          $(questionIdSelector + ctx.base.SELECTOR_SUBMIT_BTN).css("opacity", "0.5");
          $(questionIdSelector + ctx.base.SELECTOR_IMG_QUESTION_STATUS).attr('src', ctx.base.QUESTION_IMAGES.ICO_PNG_SUCCESS);
        } catch (err) {
          console.log("Failed to reset the alternative hints");
        }
      }
    } catch (err) {
      console.log("Failed to verify the initial state of the question " + err);
    }
  },

  adaptModelToLanguage: function(model) {
    if (model.lang != undefined) {

      switch(model.lang) {
        
        case "en" : 
          model.trueAlternativeSelectorLabel = "T";
          model.falseAlternativeSelectorLabel = "F";
        break;

        case "pt" :
          model.trueAlternativeSelectorLabel = "V";
          model.falseAlternativeSelectorLabel = "F";
        break

        default:
        model.trueAlternativeSelectorLabel = "T";
        model.falseAlternativeSelectorLabel = "F";
        break;
      }
    } 

    return model;
  },

  build: function (tgt, model, callback) {
    this.setTarget(tgt);

    if (model != undefined) {
      model = this.adaptModelToLanguage(model);
      this.setModel(model);
      this.setCallback(callback);
      var template = this.getTemplate();
      var questionHtml = Mustache.to_html(template, this.getModel());

      $(this.getTarget()).append(questionHtml);
      this.initEvents();
      this.verifyStateForAnsweredQuestion();
    }
  }

};
