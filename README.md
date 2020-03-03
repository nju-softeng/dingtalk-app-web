# dingtalk-vue

参考[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)


##### 前端笔记




###### js对象数组属性映射

js 对象数组的元素属性查到元素的另一个元素

```
list=[{a:1, b:2},{a:3, b:4},{a:5, b:6}]
list.find(item => item.a === 5).b
//配合vue计算属性
```



###### JSON.parse()

objectMapper.writeValueAsString(map) 传给前端的数据需要 	JSON.parse();





###### 指令权限

封装了一个指令权限，能简单快速的实现按钮级别的权限判断。 [v-permission](https://github.com/PanJiaChen/vue-element-admin/tree/master/src/directive/permission)



**eval()函数**：将字符串表达式转换成数字值。例如，语句total=eval("432.1*10")的结果是total=4321即将数值4321赋予total变量。
**parseInt()函数**：把字符串转换成整数

**parseFloat()函数**：类似于parseInt()函数，它返回字符串上包含的第一个浮点数。如果字符串不以有效浮点数开头，则返回0。



###### js日期月份加减

```
var d = new Date("2014/01/01")
d.setMonth(d.getMonth()+10);
alert(d.toISOString().slice(0, 10));
```



###### js 判断是不是字符串

```javascript
typeof(str)=='string'
```



###### Element-Ui使用Scss不生效

有些像 Sass 之类的预处理器无法正确解析>>>。这种情况下你可以使用 /deep/操作符取而代之——这是一个 >>> 的别名，同样可以正常工作。





###### div只显示部分边框

```css
border-right: 1px solid;
```



###### 修改 el-card 样式

```
.dashboard-container /deep/ .el-card__header {
  padding: 0px;
}
```



###### 修改el-table 样式

```
//滚动条的宽度
.table /deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
}
//滚动条的滑块
.table /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  border-radius: 3px;
}
```



