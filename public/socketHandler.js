(function() {
    const socket = io.connect()

    var element = function(id) {
        return document.getElementById(id);
    }

    // Get Elements
    // Chat Page
    var chatBox = element('chatBox');
    var to = element('to');
    var from = element('from');
    var chatId = element('chatId');
    var msgBox = element('msgBox');
    // Login Page
    var login = element('login')
    var inputEmail = element('inputEmail');
    // Profiles Page
    var like_btn = element('like_btn');
    var block_btn = element('block_btn');
    var liked_username = element('liked_username');
    var user_id = element('user_id');
    var curr_userUsername = element('curr_userUsername');
    var curr_userId = element('curr_userId');

    // Notification Tab
    var notify_message = element('notify-message');

    if(chatBox){
        chatBox.addEventListener('keydown', (event) => {
            if (event.which === 13 && event.shiftKey == false) {
                socket.emit('send_message', {
                    to: to.value,
                    from: from.value,
                    chatId: chatId.value,
                    message: chatBox.value,
                    time: getDateTime()
                });
                chatBox.value = '';
                event.preventDefault();
            } else {
                console.log("no")
            }
        })
    }

    if(login){
        login.addEventListener('click', (event) => {
            socket.emit("login", {email: inputEmail.value})
        });
    }

    if (like_btn){
        like_btn.addEventListener('click', () => {
            socket.emit('like', {
                likedUser: liked_username.value,
                currUser: curr_userUsername.value,
            })
        });
    };

    if (block_btn) {
        block_btn.addEventListener('click', () => {
            socket.emit('block', {
                likedUser: liked_username.value,
                currUser: curr_userUsername.value
            })
        })
    };

    // function view() {
    //     socket.emit('view', {
    //         likedUser: liked_username.value,
    //         currUser: curr_userUsername
    //     })
    // }

    socket.on('notification', (data) => {
        let notifTag = document.createElement('p');
        if (data.match == 1) {
            notifTag.textContent = data.user + " " + data.msg + "!";
        } else if (data.match == 2) {
            notifTag.textContent = data.msg + " " + data.user + "!";
        }
        notify_message.appendChild(notifTag)
    })

    socket.on('recieve_message', (data) => {
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('div');
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');

        if (from.value === data.from) {
            div1.setAttribute('class', 'media w-50 ml-auto mb-3')
            div2.setAttribute('class', 'media-body bg-white')
            div3.setAttribute('class', 'bg-danger rounded py-2 px-3 mb-2')
            p1.setAttribute('class', 'text-small mb-0 text-white')
        } else if (from.value === data.to) {
            div1.setAttribute('class', 'media w-50 mb-3')
            div2.setAttribute('class', 'media-body ml-3')
            div3.setAttribute('class', 'bg-light rounded py-2 px-3 mb-2')
            p1.setAttribute('class', 'text-small mb-0 text-muted')
        }
        p2.setAttribute('class', 'small text-muted');
        p1.textContent = data.msg;
        p2.textContent = 'from ' + data.from + ': ' + data.msgTime;

        msgBox.appendChild(div1).appendChild(div2).appendChild(div3).appendChild(p1)
        div2.appendChild(p2)
    })
})();

function getDateTime() {

var date = new Date();

var hour = date.getHours();
hour = (hour < 10 ? "0" : "") + hour;

var min  = date.getMinutes();
min = (min < 10 ? "0" : "") + min;

var sec  = date.getSeconds();
sec = (sec < 10 ? "0" : "") + sec;

var year = date.getFullYear();

var month = date.getMonth() + 1;
month = getMonth(parseInt((month < 10 ? "0" : "") + month));

var day  = date.getDate();
day = (day < 10 ? "0" : "") + day;

return hour + ":" + min + " | " + month + " " + day;

}

function getMonth(m){
    switch (m) {
        case 1:
            return "Jan"
        case 2:
            return "Feb"
        case 3:
            return "Mar"
        case 4:
            return "Apr"
        case 5:
            return "May"
        case 6:
            return "Jun"
        case 7:
            return "Jul"
        case 8:
            return "Aug"
        case 9:
            return "Sep"
        case 10:
            return "Oct"
        case 11:
            return "Nov"
        case 12:
            return "Dec"
        default:
            console.log(m)
    }
}