window.onload = function(){
	var commitMessages = [];
	var socket = io.connect();
	var commitsUl = $('#commits');
	var username = '';
	var avatarURL = '';
	var fullName = '';
	var timeStamp = '';
	var commitMessage = '';
	var currrentCommit = '';
	var li = '';
	
	var generateCommitCard = function(data) {
    	var commits = data.commits;
		repo = data.repository.name;
		currrentCommit = '';
		
		for(var i=0; i<commits.length; i++) {
			username = commits[i].committer.username;
			fullName = commits[i].committer.name;
			email = commits[i].committer.email;
			commitMessage = commits[i].message;
			avatarURL = md5(email);
			avatarURL = 'http://www.gravatar.com/avatar/'+avatarURL+'.jpg?s=80&d=monsterid'

			timeStamp = commits[i].timestamp;
			timeStamp = timeStamp.replace('T', ' ');
			timeStamp = timeStamp.substr(0, timeStamp.length - 6);

			currrentCommit =  '<li><div class="wrapper"><div class="img"><img src="'+avatarURL+'">';
			currrentCommit += '<span class="name">'+fullName+'</span></div>';
			currrentCommit += '<div class="terminal"><div class="header"><div class="buttons">';
			currrentCommit += '<img src="img/red.png" class="button red"><img src="img/yellow.png" class="button yellow">';
			currrentCommit += '<img src="img/green.png" class="button green"></div><span class="username">uniHack - Bash</span></div>';
			currrentCommit += '<p class="content">hack@macs:'+repo+' '+username+'$ git'
			currrentCommit += '<br>message: '+commitMessage+'<br> time: '+timeStamp+'</p></div></div></li>'

            commitsUl.prepend(currrentCommit);        
		}

	}
	
	
	socket.on('message', function (data) {
        generateCommitCard(data) 
    });
    
    socket.on('commits', function(commits){
        for(i=commits.length-1; i>=0; i--) {
        
            generateCommitCard(commits[i]); 
        }
    });
    
    
}