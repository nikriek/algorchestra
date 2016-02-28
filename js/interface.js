var InterfaceIntro = React.createClass({

	_onClick : function(e) {
		var closestlink = $(e.target).closest('.conductorlink, .musicianlink');
		closestlink.css({'width':'100%', 'z-index':200, 'overflow':'auto'});
		closestlink.find('.textblock').fadeOut();
		closestlink.find('.signupform').fadeIn();

		if(closestlink.hasClass('conductorlink')) {
			$('#conductorlink').prop('checked', true);
		} else {
			$('#conductorlink').prop('checked', true);
		}
  	},

	render: function() {
		return(
		<div>
			<div className="conductorlink" onClick={this._onClick}>
				<span className="textblock">
					<span className="text-subline">Continue as</span>
					<span className="text-headline">Conductor</span>
					<span className="text-subline">AND SETUP</span>
					<span className="text-subline">YOUR ORCHESTRA</span>
				</span>

				<UserSignup />
			</div>

			<div className="musicianlink" onClick={this._onClick}>
				<span className="textblock">
					<span className="text-subline">Continue as</span>
					<span className="text-headline">Musician</span>
					<span className="text-subline">AND SUPPORT AN</span>
					<span className="text-subline">EXISTING ORCHESTRA</span>
				</span>

				<UserSignup />
			</div>
		</div>
		);
	}
});


var UserSignup = React.createClass({
	_onSubmit:function(e){
		e.preventDefault();
		var formData = $(e.target).serializeObject();

		currentUser = createUser();

		currentUser.name = formData.name;
		currentUser.type = formData.type;

		pusherConnect(currentUser);

		ReactDOM.render(
			<InterfaceMain />,
			document.getElementById('wrapper')
		)
	},
  	render: function() {
    return (
    	<div className="signupform">
    		<span className="text-choosename">Choose a name</span>
			<form method="POST" action="" onSubmit={this._onSubmit}>
				<input type="text" name="name" />
				<input type="radio" name="type" value="conductor" id="conductorlink" />
				<input type="radio" name="type" value="musician" id="musicianlink" />
				<input type="submit" value="Continue →" />
			</form>
		</div>
    );
  }
});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var UserList = React.createClass({
	_onClick: function(e) {
		var _this = this;
		$.each(this.props.users, function(key, singleUser){
			if(singleUser.id == $(e.target).closest('.userentry').data('user_id')) {
				_this.props.users[key].disabled = !_this.props.users[key].disabled;
			}
		});
		this.props.onUpdate(this.props.users);
	},
  	render: function() {
      var userlistEntries = this.props.users.map(function(user) {
      	var userClassNames = 'userentry'
      	if (user.disabled) userClassNames += ' disabled';
      return (
       	<div className={userClassNames} key={user.id} style={{backgroundColor: '#' + user.color}} data-user_id={user.id} onClick={this._onClick}>
			<span className="name">{user.name}</span>
		</div>
      );
    }.bind(this));

    return (
		<aside id="userlist" className="sidebar">
			<div className="head">
				<span>The Orchestra</span>
			</div>

        	{userlistEntries}
		</aside>
    );
  }
});

var UserCircles = React.createClass({
	_onClick: function(e) {
		var _this = this;
		$.each(this.props.users, function(key, singleUser){
			if(singleUser.id == $(e.target).closest('.usercircle').data('user_id')) {
				_this.props.users[key].disabled = !_this.props.users[key].disabled;
			}
		});
		this.props.onUpdate(this.props.users);
	},
  	render: function() {
  		var userCircles = this.props.users.map(function(user) {
  		var userClassNames = 'usercircle'
      	if (user.disabled) userClassNames += ' disabled';
	      return (
	      	<div className={userClassNames} key={user.id} style={{backgroundColor: '#' + user.color, top: getRandomInt(10,90) + '%', left: getRandomInt(30,70) + '%'}} data-user_id={user.id} onClick={this._onClick}>
				<span className="usercircle-ring active" style={{borderColor: '#' + user.color}}></span>
			</div>
	      );
    	}.bind(this));

    	return (
		<section id="usercircles">
			{userCircles}
		</section>
    	);
  	}
});

var CurrentUserSounds = React.createClass({
	_addSound: function(){
		/*
		var newSound = {'key': prompt('Enter letter'), 'code': prompt('Enter code')};
		var tmpUsers = window.interfaceMain.props.users;
		console.log(tmpUsers);
		$.each(tmpUsers, function(key, singleUser){
			if(singleUser.info.id = this.props.user.id) {
				tmpUsers[key].sounds.push(newSound);
			}
		});
		window.interfaceMain.setState({'users': tmpUsers});
		*/
	},
  	render: function() {
	    var userSounds = this.props.user.sounds.map(function(sound) {
	      return (
			<div className="sound" key={sound.key}>
				<span className="key">{sound.key}</span>
				<blockquote className="code">
					<span>{sound.code}</span>
				</blockquote>
			</div>
	      );
	    });

    	return (
		<aside id="keylist" className="sidebar">
			<div className="head">
				<span>Your Sounds</span>
			</div>

			{userSounds}

			<a className="button" onClick={this._addSound}>Add new</a>
		</aside>
    );
  }
});

var InterfaceMain = React.createClass({
	getInitialState: function() {
        return { users: [] };
    },
    _updateUserList: function() {
    	var tmpUsers = [];
    	channel.members.each(function(user){
    		tmpUsers.push(user.info);
    	});
    	this.setState({users: tmpUsers});
	},
	componentDidMount: function() {
	  window.interfaceMain = this;
	},
  	render: function() {
	    return (
	      <div id="mainview">
			<div id="usercolorbar" style={{backgroundColor: '#' + currentUser.color}}></div>

			<UserList users={this.state.users} onUpdate={this.onUpdate} />
			<UserCircles users={this.state.users} onUpdate={this.onUpdate} />
			<CurrentUserSounds user={currentUser} />
		</div>
	    );
	  },
	  onUpdate: function(users){
	      this.setState({
	          users: users
	      });
	  }
});


ReactDOM.render(
	<InterfaceIntro />,
	document.getElementById('wrapper')
)
