var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Houston";

var numberOfResults = 3;

var APIKey = "4844d21f760b47359945751b9f875877";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Houston is the most populous city in Texas and the forth-most populous city in the United States. With an estimated residents of 2.239 million as of 2014, Houston is also the largest city in the Southern United States.";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Houston Zoo", content: "The Houston Zoo is a 55-acre (22 ha) zoological park located within Hermann Park in Houston, Texas. The Zoo houses over 6,000 animals as a part of over 900 species that the zoo has to offer, and receives 1.8 million visitors each year and is the tenth most visited zoo in the United States.", location: "6200 Hermann Park Dr, Houston, TX 77030-1710", contact: "713 533 6500" },
    { name: "The Houston Museum of Natural Science", content: "The Houston Museum of Natural Science is a science museum located on the northern border of Hermann Park in Houston, Texas. The museum was established in 1909 by the Houston Museum and Scientific Society, an organization whose goals were to provide a free institution for the people of Houston focusing on education and science. Museum attendance totals over two million visitors each year.", location: "5555 Hermann Park Dr, Houston, TX 77030", contact: "713 639 4629" },
    { name: "Museum of Fine Arts, Houston", content: "The Museum of Fine Arts, Houston, located in the Houston Museum District, Houston, is one of the largest museums in the United States. The permanent collection of the museum spans more than 6,000 years of history with approximately 64,000 works from six continents.", location: "1001 Bissonnet St, Houston, TX 77005", contact: "713 639 7300" },
    { name: "Children's Museum of Houston", content: "The Children’s Museum of Houston is a children's museum in the Museum District in Houston, Texas. The museum is one of 190 children's museums in the United States and 15 children's museums in Texas.", location: "1500 Binz St, Houston, TX 77004", contact: "713 522 1138" },
    { name: "Space Center Houston", content: "Space Center Houston is the official visitor center of the Lyndon B. Johnson Space Center—the National Aeronautics and Space Administration's center for human spaceflight activities—located in Houston, Texas.", location: "1601 NASA Road 1, Houston, TX 77058", contact: "281 244 2100" },
];

var topFive = [
    { number: "1", caption: "Explore Herman Park.", more: "Hermann Park is one of Houston's most-visited public parks. Situated between Fannin Street and Cambridge Street, it is within walking distance from the Texas Medical Center, Rice University, and the Museum District, and within a few miles of the Third Ward, the historic Astrodome and NRG Stadium (home stadium for the Houston Texans). The land that it occupies was presented to the City of Houston by George H. Hermann in 1914.", location: "6001 Fannin St, Houston, TX 77030", contact: "713 524 5876" },
    { number: "2", caption: "Get shopping at the Galleria.", more: "The Galleria, stylized theGalleria or the Houston Galleria, is an upscale mixed-use urban development centrally located in the Uptown District of Houston, Texas.", location: "5085 Westheimer Rd, Houston, TX 77056", contact: "713 966 3500" },
    { number: "3", caption: "Explore the depths of the Downtown Aquarium.", more: "Sprawling spot for sea life, including touch pools, shark tank & displays of aquatic ecosystems.", location: "410 Bagby St, Houston, TX 77002", contact: "713 223 3474" },
    { number: "4", caption: "Kindle your ingenuity at Rice University.", more: "William Marsh Rice University, commonly referred to as Rice University or Rice, is a private research university located on a 295-acre campus in Houston, Texas.", location: "6100 Main St, Houston, TX 77005", contact: "713 348 0000" },
    { number: "5", caption: "Watch your step at Brazos Bend State Park.", more: "Brazos Bend State Park is a 4,897-acre state park along the Brazos River in Needville, Texas, run by the Texas Parks and Wildlife Department. It's a natural Aligator park with lots of exciting things to see and do.", location: "21901 FM 762 Rd, Needville, TX 77461", contact: "979 553 5102" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'getNewsIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function () {

        output = locationOverview;

        this.emit(':tellWithCard', output, location, locationOverview);
    },

    'getAttractionIntent': function () {

        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },

    'getTopFiveIntent': function () {

        output = topFiveIntro;

        var cardTitle = "";

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }

        output += topFiveMoreInfo;

        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },

    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },

    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=houston&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + encodeURI(query) + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
