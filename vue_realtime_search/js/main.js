var app = new Vue ({
  el: '#app',
  data: {
    items: null, //apiから引っ張ってきた部分
    keyword: '', //ユーザの検索結果
    message: '' //ユーザーに表示する部(errorとかロード中とか)
  },
  watch: {
    keyword: function(newKeyword, oldKeyword){
    // console.log("新しい値は %s",newKeyword);
    // console.log("古い値は %s",oldKeyword);
    this.message = "文字を入力中です"
    this.debouncedGetAnswer()
    }
  },
  created: function(){//【疑問】ここからgetanswerを呼ぶのはいいがcreated function自身はいつ呼ばれたのか？？
                      //vueにはライフサイクルがあり呼ばれる順番が決まっている
                      //ライフサイクルフックとは、vueインスタンスの作成か亜r破棄までに行われる処理の順番のこと
    // this.keyword = 'JavaScript'
    // this.getAnswer()
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 1000)//指定時間内に同じ処理が発生したらこの処理は実行しない
  },
  methods: {
    getAnswer: function(){
      if(this.keyword === ''){//検索欄が空なら検索結果欄を削除(以前調べていたものを消す)
        this.items = null
        this.message = ''
        return
      }
      
      this.message = '検索中...'
      var vm = this //axiosでvueインスタンスのプロパティにアクセスするためにthisをローカル変数に格納しておく
      var params = { page: 1, per_page: 20,query: this.keyword}//apiに使用するパラメータはkey,valueで持っておく
      axios.get('https://qiita.com/api/v2/items', {params})//apiをたたく
      .then(function(response){
        console.log(response)
        vm.items = response.data
      })
      .catch(function(error){
        vm.message = 'error' + error
      })
      .finally(function(){
        vm.message = ''
      })
    }
  }
})