/***********************************************
 * Final version of the workshop script
 *
 * Here are points worth going through
 *
 * 1. Introduce sequence
 * 2. Pages and questions
 * 3. text question, selectOne question
 * 4. Using inheritance for prototyping (freqScore)
 * 5. Using inheritance for randomization
 * 6. Mixers: repeat
 * 7. Templating, getting info from other questions
 * 
 **********************************************/
define(['questAPI'], function(APIConstructor) {

    var API = new APIConstructor();

    API.addQuestionsSet('freqScore', [
        {
            type:'selectOne',
            answers:[
                'Never',
                'Sometimes',
                'Frequently',
                'All the time'
            ]
        }
    ]);

    API.addQuestionsSet('anxietyQuestions', [
        { name: 'w1', inherit: 'freqScore', stem: 'How often do you worry about your future?'},
        { name: 'w2', inherit: 'freqScore', stem: 'How often do you feel that you can not stand it any more?'},
        { name: 'w3', inherit: 'freqScore', stem: 'How often do you feel stressed?'}
    ]);

    API.addSequence([
        {
            header: 'Question page',
            questions: [
                { type:'text', stem: 'Please insert your name', name: 'username'},
                { 
                    type:'selectOne',
                    stem: 'What is your favorite flavor of icecream?',
                    name: 'icecream',
                    answers:[
                        'Strawberry',
                        'Chocolate',
                        'Vanilla'
                    ]
                },
            ]
        },
        {
            mixer:'repeat',
            times: 3,
            data: [
                {
                    header: 'Hello <%= current.questions.username.response %>',
                    questions: [ {inherit:{type:'exRandom', set:'anxietyQuestions'}} ]
                }

            ]
        }

    ]);	

    return API.script;
});
