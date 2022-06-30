$(document).ready(function() {

    const sleep = (ms) => {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
    };

    const environmentHashtags = '#ClimateHoax  #LiesAndMoreLies #ClimateCrisis';
    var environmentTweets = [];

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    function getRandomNumber(min, max) {

        return Math.random() * (max - min) + min;

    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    async function showTweets(tweets, hashtags){
        for (i=0;i< tweets.length && i <= 120; i++){
            let currentTweet = tweets[i];
            const newDiv = document.createElement("div");
            let textSize = Math.floor(getRandomNumber(1,4));
            newDiv.innerHTML = "<h"+textSize+">@"+currentTweet.user+": "+currentTweet.text+"</h"+textSize+"><h6>❤️"+currentTweet.fav+" 🔂"+currentTweet.retweet+"</h6>";
            document.getElementById("og_div").appendChild(newDiv);
            let randomTop = getRandomNumber(0, winHeight);
            let randomLeft = getRandomNumber(0, winWidth);
            newDiv.style.cssText = 'position:absolute;\n' +
                ' top:'+randomTop+'px;' +
                ' left:'+randomLeft+'px; ' +
                ' background: none no-repeat scroll 0 0 #000000;';
            await sleep(2.5*1000)
            newDiv.style.cssText += 'color: rgba(255,255,255, 0.3);';
        }
        const newDiv = document.createElement("div");
        newDiv.innerHTML = "<h1>"+hashtags.replace(" ","<br>")+"</h1>";
        document.getElementById("og_div").appendChild(newDiv);
        newDiv.style.cssText = 'position:absolute;' +
            ' top:'+winHeight/2+'px;' +
            ' left:'+winWidth/2+'px; ' +
            ' background: none no-repeat scroll 0 0 #000000;' +
            ' color: #1DA1F2;';
        await sleep(10*1000)
        var el = document.getElementById('og_div');
        while ( el.firstChild ) el.removeChild( el.firstChild );
        await startSimulation(environmentHashtags)
    }

    async function startSimulation(hashtags){
        $('#experience-form').hide(1000);
        $('#loading').show(1000);
        if (hashtags === environmentHashtags && environmentTweets.length !== 0 ) {
            $('#loading').hide(1000);
            await showTweets(environmentTweets, environmentHashtags)
        } else {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: "http://127.0.0.1:5000/tweet-by-hashtag",
                data: {hashtags : hashtags},
                success: async function(result) {
                    $('#loading').hide(1000);
                    tweets = shuffle(result.tweets)
                    if (hashtags === environmentHashtags)
                        environmentTweets = tweets
                    await showTweets(tweets, hashtags)
                }
            });
        }
    }


    $("#btnAnnotation").click(async function(e) {
        await startSimulation($("#inputTweet").val());
    });

    $("#btnSimulation").click(async function(e) {
        await startSimulation(environmentHashtags);
    });

});