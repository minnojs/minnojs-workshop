define(['timeAPI'], function(APIConstructor) {

    var API = new APIConstructor();

    API.addMediaSets('attributes', [
        {word:'Good'},
        {word:'Bad'},
        {word:'Light'},
        {word:'Dark'},
        {word:'Awsome'},
        {word:'Horible'}
    ]);

    API.addSequence([
        {
            mixer:'repeat',
            times:10,
            data: [
                {
                    input: [ 
                        {handle:'left',on:'keypressed', key:'f'},
                        {handle:'right',on:'keypressed', key:'j'}
                    ],
                    stimuli: [
                        { media: 'Good', location: {top:0,left:0}},
                        { media: 'Bad', location: {top:0,right:0}},
                        { media :{inherit:'attributes'}, handle:'target'}
                    ],
                    interactions: [
                        {
                            conditions: [ {type:'begin'} ],
                            actions: [ 
                                {type:'showStim', handle:'All'},
                                {type:'trigger', handle:'targetOut',duration:1000}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals', value:'targetOut'}],
                            actions: [ {type:'hideStim', handle:'target'}]
                        },
                        {
                            conditions: [ {type:'inputEquals', value: ['left','right']} ],
                            actions: [ {type:'endTrial'} ]
                        }
                    ]
                }
            ]
        }
    ]);	
			
	return API.script;
});
