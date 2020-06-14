$(document).ready(function(){
    let name = '高晓松'
    // function getData(){
    //     var urlinfo = window.location.href//获取url 
    //     let value1 = urlinfo.split("?name=")[1]   
    //     name = decodeURI(value1)
        $('.name').text("考生：" + name)

    // }
    // getData()


    //从后台获取题目
    let multiples = []
    $.ajax({
        type: "GET",
        async: false,
        url: "questions.txt",
        dataType: "json",
        data:'',
        success: function(data){
            multiples = data
        },
        error: function(e){
            console.log(e)
        }
    });
    let judges = []
    $.ajax({
        type: "GET",
        async: false,
        url: "judge.json",
        dataType: "json",
        data:'',
        success: function(data){
            judges = data
        },
        error: function(e){
            console.log(e)
        }
    });

    let i = 0

    var questions = multiples.concat(judges) //选择题和判断题的数组合并
    var totalQues = questions.length
     //动态添加题号
    for(let index = 1; index <= totalQues; index++){
        if(index <= multiples.length){
            $('.multiple').append('<div class="choice">'+index+'</div>')
        }else{
            $('.judge').append('<div class="choice">'+index+'</div>')
        }
        
    }

    //把正确答案单独取出来
    let correct = []
    
    for(let index = 0; index < totalQues; index++){
        if(index < multiples.length){  //添加选择题答案
            correct.push(multiples[index].option_true)
        }else{ //添加判断题答案
            let another = index - multiples.length
            correct.push(judges[another].judge_answer)
        }
        
    }console.log(correct)
    //存放考生选择的选项
    let checkOptions = []
    function getCheckOption(e, k){
        let checkval
        if(k === 0){
            checkval = $(':checkbox')
        }else{
            checkval = $(':radio')
        }
        
        for(let v =0; v<checkval.length; v++){
            if(v != e){
                checkval[v].checked = false;
            }else{
                //把数据存入数组
                
                checkOptions[i] = checkval[v].value;
            }
        }

    }

    $('#box1').on('click', function(){
        getCheckOption(0, 0)
    })
    $('#box2').on('click', function(){
        getCheckOption(1, 0)
    })
    $('#box3').on('click', function(){
        getCheckOption(2, 0)
    })
    $('#box4').on('click', function(){
        getCheckOption(3, 0)
    })
    $('#box5').on('click', function(){
        getCheckOption(0, 1)
    })
    $('#box6').on('click', function(){
        getCheckOption(1, 1)
    })

    //清空选项
    function deleteChecked(i){
        let checkval
        if(i < multiples.length){
            checkval = $(':checkbox')
        }else{
            checkval = $(':radio')
        }
        
        for(let v =0; v<checkval.length; v++){
            checkval[v].checked = false;
        }
        //如果题目是在之前已经做过的，在checkOptions数组里有数据，直接拿到之前做过的选项,选项不清空
        let checkedOpt = checkOptions[i];
			if(checkedOpt != null){
				//取出之前的选择，令checked = true;
				checkOpts(checkedOpt, checkval);
			}
    }
    deleteChecked(0)
    function checkOpts(t, x){
            if(t === 'A'){
                x[0].checked = true;
            }else if(t === 'B'){
                x[1].checked = true; 
            }else if(t === 'C'){
                x[2].checked = true;
            }else if(t === 'D'){
                x[3].checked = true;
            }else if(t === 0){
                x[0].checked = true;
            }else if(t === 1){
                x[1].checked = true;
            }else{
                console.log("前往deleteChecked寻找不正确代码");
            }
        
    }

    //显示题目和选项
    function showQue(i){
        $('.choice').eq(i).addClass('current').siblings().removeClass('current')
        if(i < multiples.length){//选择题选项
            $(".question").html("第"+questions[i].question_id+"题：</br></br>"+questions[i].question_subject)
            $('.MultipleAnswer').css('display','block')
            $('.JudgeAnswer').css('display', 'none')
            $('.boxA').text(questions[i].option_a)
            $('.boxB').text(questions[i].option_b)
            $('.boxC').text(questions[i].option_c)
            $('.boxD').text(questions[i].option_d)
        }else{//判断题选项
            $(".question").html("第"+questions[i].judge_id+"题：</br></br>"+questions[i].judge_subject)
            $('.MultipleAnswer').css('display','none')
            $('.JudgeAnswer').css('display', 'block')
        }
        
    }
    showQue(i)

    //算出得分
    let score = 0
    function getSore(){
        for(let n = 0; n < checkOptions.length; n++){
            if(checkOptions[n]==correct[n]){
                score +=1;
            }
        }
        
    }
    // 倒计时
    function countTime(){
        let minutes = 1
        let seconds = 59
        let time = window.setInterval( ()=>{
            let s = 59;
            let m;
            if (seconds === 0 && minutes !== 0) {
                seconds = 59;
                minutes -= 1;
            } else if (minutes === 0 &&seconds === 0) {
                $('.time').text( "00:00")
                getSore()
                alert("考试结束，已自动提交")
                window.location.href = "down.html?name="+ name +"&score="+score
                window.clearInterval(time)
                
            } else {
               seconds -= 1;
                if (seconds < 10) {
                    s = "0" +seconds;
                } else{
                    s = seconds;
                }
                if (minutes < 10) {
                    m = "0" +minutes;
                } else{
                    m = minutes;
                }
            }
            $('.time').text(m + ":" + s)
        }, 1000);
    }
    countTime()

    //上一题
    $('.prev').on('click', function(){
        if(i == 0){
            alert('你正在做第一题')
        }else{
            i--;
            showQue(i)
            deleteChecked(i)
        }

    })

    //下一题
    $('.next').on('click', function(){
        if(i == totalQues-1){
            alert('你正在做最后一题')
        }else{
            i++;
            showQue(i)
            deleteChecked(i)
            
        }

    })

    //提交
    $('.submit').on('click', function(){
        getSore()
        alert("已提交")
        checkOptions = []
        window.location.href = "down.html?name="+ name +"&score="+score
    })


    
});