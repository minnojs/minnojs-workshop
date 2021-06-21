define(['timeAPI'], function(APIconstructor) {

    var API     = new APIconstructor();

 	API.addCurrent({
        instructions: {
            inst_welcome :  '<p>Welcome to the experiment!</p></br>'+
                            '<p>We will show you items, one after the other.</p>'+
                            '<p>Your task is to indicate the color of each item.</p></br>'+
                            '<p>If the color of the item is <span style="color:blue">blue</span>, hit the <b>i</b> key with your right hand.</p>'+
                            '<p>If the color of the item is <span style="color:red">red</span>, hit the <b>e</b> key with your left hand.</p></br>'+
                            '<p>Please put your fingers on the keyboard to get ready</p></br>'+
                            '<p>Press SPACE to start</p>',
            inst_bye     : '<p>This is the end of the experiment</p>'+ 
                           '<p>Thank you for your participation</p>'+
                           '<p>To end please press SPACE</p>'
        },
        durations: {
            fixation : 1000,
            stimulus : 500,
            response : 1000,
            feedback : 1000,
            iti      : 1000
        }
	}); 

    API.addSettings('canvas',{
        textSize         : 5,
        maxWidth         : 1200,
        proportions      : 0.65,
        borderWidth      : 0.4,
        background       : 'white',
        canvasBackground : 'white'	
    });


    /***********************************************
    // Stimuli
     ***********************************************/

    API.addStimulusSets({
        defaultStim    : [{css:{color:'black', 'font-size':'100px'}}],
        fixation       : [{inherit:'defaultStim', media: '+'}],
        timeoutmessage : [{inherit:'defaultStim', media: 'Respond faster!'}]
    });

    /***********************************************
    // INSTRUCTIONS TRIALS
     ***********************************************/    
    API.addTrialSets('insts',{
        input: [ 
            {handle:'space',on:'space'} 
        ],
        interactions: [
            { 
                conditions: [{type:'inputEquals',value:'space'}], 
                actions: [
                    {type:'endTrial'}				
                ]
            }
        ]
    });
    
    API.addTrialSets('inst_welcome',{
        inherit:'insts',
	    layout: [
            {media: {html: '<%= current.instructions.inst_welcome %>'}}
        ]
    });

    API.addTrialSets('inst_bye',{
        inherit:'insts',
	    layout: [
            {media: {html: '<%= current.instructions.inst_bye %>'}}
        ]
    });

    /***********************************************
    // Main trials
     ***********************************************/
    API.addTrialSets('stimulus_trial',[{ 
        interactions: [
            // Show fixation
            { 
                conditions: [{type:'begin'}],
                actions: [
                    {type:'showStim', handle:'fixation'},
                    {type:'trigger', handle:'showTarget', duration: '<%= current.durations.fixation %>'}
                ]
            }, 
            // Show stimulus
            {
                conditions:[{type:'inputEquals',value:'showTarget'}],
                actions: [
                    {type:'hideStim', handle:'fixation'}, 
				    {type:'setInput', input:{handle:'blueKey', on: 'keypressed', key: 'i'}},
				    {type:'setInput', input:{handle:'redKey', on: 'keypressed', key: 'e'}},
				    {type:'showStim', handle: 'target'},
                    {type:'resetTimer'},
                    {type:'trigger', handle:'timeout', duration: '<%= current.durations.response %>'},
                    {type:'trigger',handle:'targetOut', duration: '<%= current.durations.stimulus %>'}
                ]
            },
            // Hide stimulus
            {
                conditions: [{type:'inputEquals', value:'targetOut'}], 
                actions: [
                    {type:'hideStim', handle:'target'}
                ]
            }, 	
            // Correct response
            { 
                conditions: [{type:'inputEqualsStim', property:'correct'}], 
                actions: [
                    {type:'setTrialAttr', setter:{score:1}},
                    {type:'log'},
                    {type:'hideStim', handle:['All']},
                    {type:'trigger', handle:'ITI'}
                ]
            }, 
            // Incorrect response
            {
                conditions: [
                    {type:'inputEquals', value:['blueKey','redKey']}, 
                    {type:'inputEqualsStim', property:'correct', negate:true}
                ],
                actions: [
                    {type:'setTrialAttr', setter:{score:0}},
                    {type:'log'},
                    {type:'hideStim', handle:['All']},
                    {type:'trigger', handle:'ITI'}
                ]
            }, 
            // Timeout
            {
                conditions: [
                    {type:'inputEquals',value:'timeout'}
                ],
                actions: [
                    {type:'setTrialAttr', setter:{score:-1}},
                    {type:'log'},					
                    {type:'trigger', handle:'ITI'},
                    {type:'showStim', handle:'timeoutmessage'}
                ]
            }, 
            {
                conditions: [{type:'inputEquals', value:'ITI'}],
                actions:[
                    {type:'removeInput', handle:['All']},
                    {type:'trigger', handle:'end', duration:'<%= current.durations.iti %>'}
                ]
            },
            {
                conditions: [{type:'inputEquals', value:'end'}],
                actions: [{type:'endTrial'}]
            }
        ],
        stimuli : [
            {inherit:'timeoutmessage'},
            {inherit:'fixation'},
            {media: '<%= trialData.text %>', css:{fontSize: '100px', color:'<%= trialData.color %>'}, handle:'target', data:{correct:'<%= trialData.correct %>'}}
        ]
    }]);

    /***********************************************
    // Stimuli
     ***********************************************/
    API.addTrialSet('cong', [
        {inherit: 'stimulus_trial', data: {text: 'BLUE', color: 'blue', correct:'blueKey'}},
        {inherit: 'stimulus_trial', data: {text: 'RED', color: 'red', correct:'redKey'}}
    ]);
    
    API.addTrialSet('incong', [
        {inherit: 'stimulus_trial', data: {text: 'BLUE', color: 'red', correct:'redKey'}},
        {inherit: 'stimulus_trial', data: {text: 'RED', color: 'blue', correct:'blueKey'}}
    ]);
    
    API.addTrialSet('neu', [
        {inherit: 'stimulus_trial', data: {text: 'XXXX', color: 'blue', correct:'blueKey'}},
        {inherit: 'stimulus_trial', data: {text: 'XXXX', color: 'red', correct:'redKey'}}
    
    ]);

    /***********************************************
    // Sequence
     ***********************************************/
	API.addSequence([
	    { inherit : {set:'inst_welcome'} },
	    {
			mixer: 'random',
			data: [
				{
					mixer: 'repeat',
					times: 15,
					data: [
                        {inherit:{set:'cong', type:'equalDistribution', n: 4, seed: 'congE'}},
                        {inherit:{set:'incong', type:'equalDistribution', n: 4, seed: 'incongE'}},
                        {inherit:{set:'neu', type:'equalDistribution', n: 4, seed: 'neuE'}}
					]
				}
			]
		},
		{ inherit : {set:'inst_bye' } }
	]);	

	return API.script;
});
