
# 简介
能够实现通过ar将文件上传到ar网络上
# 环境搭建
设置index.js中的key变量，这是私钥
```
npm install
```
# 命令
## 获取当前账户余额
```
node index.js balance
```
## 上传文件
```
node index.js upload <file_path> "<tag json>"
```
其中
- file_path为要上传文件的路径
- tag json为文件的tag

## 获取文件信息
```
node index.js get_data <id> <out_path>
```
其中
- id 上传文件是返回的id
- out_path 为文件保存的名称
- 另：返回tag信息

## 获取交易的状态
```
node index.js get_status <id>
```