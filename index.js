const Arweave = require('arweave');
const fs = require("fs");

var key = "key"

// 获取key的地址
async function GetAddress(arweave, key) {
  let addr = await arweave.wallets.jwkToAddress(key) 
  // console.log(addr)
  return addr
}

//主函数
async function Main(){
  // 参数处理
  const args = process.argv.slice(2)
  if (args.length == 0) {
    console.log("node index.js balance")
    console.log("node index.js upload <file_path> \"<tag json>\"")
    console.log("node index.js get_data <id> <out_path>")
    console.log("node index.js get_status <id>")
    return
  }
  // 链接网络
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  // 查询余额
  if (args[0] == "balance") {
    let address = await GetAddress(arweave, key)
    console.log(await arweave.wallets.getBalance(address))
    let balance =  arweave.ar.winstonToAr( await arweave.wallets.getBalance(address))
    console.log(JSON.stringify({
      resullt:0,
      data:balance
    }))
  } else if (args[0] == "upload") {
    var file_name = args[1]
    var tags = JSON.parse(args[2])
    let data = fs.readFileSync(file_name);
    let transaction = await arweave.createTransaction({ data: data }, key);

    for(var tag_key in tags) {
      transaction.addTag(tag_key, tags[tag_key]);
    }
    await arweave.transactions.sign(transaction, key);
    let uploader = await arweave.transactions.getUploader(transaction);
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }
    console.log(transaction)
    console.log(JSON.stringify({
      result: 0,
      data:transaction.id
    }))
  } else if (args[0] == "get_data") {
    var id = args[1]
    var file_name = args[2]
    var tx = await arweave.transactions.get(id)
    var data = tx.data
    var result = 0
    // 写入文件
    fs.writeFile(file_name,data, function(err){
      if (err) {
        result = -1
      } else {
        result = 0
      }
    })

    var rtn = {}
    tx.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      rtn[key] = value
    });
    console.log(JSON.stringify({
      resullt:0,
      data: rtn
    }))
  } else if (args[0] == "get_status") {
    var id = args[1]
    var status = await arweave.transactions.getStatus(id)
    console.log(status)
  }
}
Main()
