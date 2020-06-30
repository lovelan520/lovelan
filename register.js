(function () {
    // 1、验证输入的用户名是否正确
    // 获取用户名输入框  并注册失焦事件   同时获取输入框的内容并做判断
    $('.name').on('blur', function () {
        var userName = $(this).val();
        // 发送ajax请求
        $.ajax({
            type: 'get',
            url: './sever/validateUserName.php',
            data: {
                name: userName
            },
            dataType: 'json',//数据类型是json字符串
            beforeSend: function () {
                // 判断输入用户名是否为空
                if (userName.trim() == '') {
                    // 如果为空  提示用户输入有问题
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text('用户名输入不正确，请重新输入')
                    return false;
                }
            },
            success: function (res) {
                if (res.code == 0) {
                    // 如果成功  把成功提示的内容反馈出来
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text(res.msg)
                } else {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text(res.msg)
                }
            }
        })
    });
    // 2、验证手机号码输入是否正确
    // 获取手机号输入框内容   并对手机号进行正则判断   同时获取验证码按钮   并注册点击事件
    $('.verify').on('click', function () {
        // 判断  如果注册按钮有禁用状态  那么就不发送请求
        if ($(this).hasClass('disabled')) {
            return;
        }
        var phone = $('.mobile').val();
        // 发送ajax请求
        $.ajax({
            type: 'get',
            url: './sever/getCode.php',
            data: {
                mobile: phone
            },
            beforeSend: function () {
                if (!(/13[0-9]|14[37]|15[0-35-9]|17[0-9]|18[0-35-9]^\d{8}$/.test(phone))) {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text('手机号输入不正确，请重新输入');
                    return false
                };
                // 如果手机号正确   添加一个禁用类  同时开始倒计时
                $('.verify').addClass('disabled');
                var count = 0;
                var timerId = setInterval(function () {
                    count--;
                    // 倒计时  同时告诉用户等待时间
                    $('.verify').val(count + '秒后获取验证码')
                    if (count < 0) {
                        // 如果倒计时小于0  那么就清除定时器  同时告诉用户重新获取
                        clearInterval(timerId);
                        $('.verify').removeClass('disabled').val('重新获取验证码')
                    }
                }, 1000)
            },
            success: function (res) {
                alert(res)
            }
        })
    });
    // 3、完成立即注册事件
    // 给立即注册按钮注册submit事件（实际是给form表单注册）   同时要注意取消默认提交行为
    $('#ajaxForm').on('submit', function (e) {
        // 取消默认提交行为
        e.preventDefault();
        // 使用系列化的方式获取到form表单各个input标签里的内容  serialize序列化获取到的内容可以自动转化为拼接好的字符串
        var data = $(this).serialize();
        //   发送ajax请求
        $.ajax({
            type: 'post',
            url: './sever/register.php',
            data: data,
            beforeSend: function () {
                // 判断两次输入的密码是否一致  如果不一致就不发送请求  并提示用户两次输入密码不一致  并清空
                if ($('.pass').val().trim() == $('.repass').val().trim()) {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text('两次输入密码不一致  请重新输入');
                    $('.pass,.repass').val('');
                    return false
                }
                // 如果有一项输入框没有输入也不能提交
                var flag = true;//假设全都输入
                $('input[name]').each(function (index, item) {
                    if ($(item).val().trim() == '') {
                        flag = false;
                    }
                });
                if (flag == false) {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text('输入框不能为空  请重新输入');
                    return false;
                };
                // 如果以上输入全部正确  禁用按钮  并更改内容
                $('.submit').addClass('disabled').val('正在注册中...');
            },
            dataType: 'json',
            success: function (res) {
                if (res.code == 1) {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text(res.msg);
                    // 同时将表单的内容全部清空  也就是重置
                    $('#ajaxForm')[0].reset();
                } else {
                    $('.tips p').fadeIn(500).delay(2000).fadeOut(500).text(res.msg);
                }
            },
            complete: function () {
                // 无论成功还是失败  否会走complete
                // 让按钮恢复原状
                $('.submit').removeClass('disabled').val('立即注册');
            }
        })
    })
})()