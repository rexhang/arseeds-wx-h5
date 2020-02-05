// 返回当前地址href
var getLocationHref = () => {
    return window.location.href;
}

// 选美类
class BeautifulGirl{
    constructor(name, age, height, threeDimensional){
        this.name             = name;             // 姓名
        this.age              = age;              // 年龄
        this.height           = height;           // 身高
        this.threeDimensional = threeDimensional; // 三围
    }
    beChosen(){
        if(this.name && this.age < 28 && this.height > 168 && this.threeDimensional){
            return 'Congratulations! You are selected and your info is : 名字：' + this.name + '&年龄：' + this.age + '&身高：' + this.height + '&三围' + this.threeDimensional;
        }
    }
}

exports.getLocationHref = getLocationHref;
exports.BeautifulGirl   = BeautifulGirl;