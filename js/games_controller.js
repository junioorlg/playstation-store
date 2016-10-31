var games_controller = games_controller || (function () {

    var self, 
    _tpl =   $("#gamesTpl").html()

    return {
        init: function () {

            self = this
            
            // Render game list
            self.renderList()

            // Enable sorting list
            self.activeSorting()

            // Enable add new game
            $("#add").on("click", self.addGame)

            // Enable show edit game 
            $(".show-edit").on("click", self.showEditGame)

            // Enable edit game
            $("#edit").on("click", self.editGame)

            // Enable delete game
            $(".delete").on("click", self.deleteGame)

            // Enable reset form
            $("#reset-form").on("click", self.resetForm)

            // Delete class error for inputs
            $("#title, #description").keypress(function(){
                if ($(this).parent().hasClass('error'))
                    $(this).parent().removeClass('error')
            })

            $("#img").change(self.imgValid)
        },

        imgValid: function(){
            var file, img, _URL = window.URL || window.webkitURL;

            if ((file = this.files[0])) {
                img = new Image();
                img.onload = function() {
                    $("#txtImg").parents(".input-field").removeClass('error')
                    $("span.error").addClass("hidden")
                    if (this.width >= 320 || this.height >= 320){
                        $("#txtImg").val("")
                        $("span.error").removeClass("hidden")
                        $("#txtImg").parents(".input-field").addClass('error')
                    }
                };
                img.onerror = function() {
                    alert( "not a valid file: " + file.type);
                };
                img.src = _URL.createObjectURL(file);
            }
        },

        activeSorting: function(){

            $("#sortable1").sortable({
                stop: function(e, ui) {
                    $('.game').each(function(i){
                        $(this).attr("data-order", i)
                    });
                    self.listOrder();
                }
            }).disableSelection();

            $('.ui-sortable-handle')
                .mouseenter(function(){
                    $(this).find(".panel").show();
                })
                .mouseleave(function(){
                    $(this).find(".panel").hide();
                });
                
        },

        listOrder: function(){
            var collection = self.getCollection();
            for (j in collection){
                $('.game').each(function(i){
                    if(collection[j].id == $(this).attr("id")){
                        collection[j].order = $(this).attr("data-order");
                    }
                });
            }        

            self.updateCollection(collection)
        },

        getCollection: function() {
            if(JSON.parse(localStorage.getItem('games'))==null)
                self.saveCollection()

            //console.log(JSON.parse(localStorage.getItem('games')));
            return JSON.parse(localStorage.getItem('games'))
        },

        saveCollection: function() {

            var newCollection = [
                {
                    "id" : "1",
                    "img" : "media/horizon.jpg",
                    "title" : "Horizon",
                    "description" : "Este es el juego Horizon",
                    "order" : 1
                },
                {
                    "id" : "2",
                    "img" : "media/division.jpg",
                    "title" : "The division",
                    "description" : "Este es el juego The division",
                    "order" : 2
                },
                {
                    "id" : "3",
                    "img" : "media/fifa17.jpg",
                    "title" : "Fifa 17",
                    "description" : "Este es el juego Fifa 17",
                    "order" : 3
                }
            ]

            self.updateCollection(newCollection)

            return self.getCollection()
        },

        addGame: function() {
            if( self.validForm() == false)
                return false;

            var newGame = self.getNewGame()

            var collection = self.getCollection()
            
            collection.push(newGame)


            self.resetForm()
            self.saveImgGame()
            setTimeout(function(){
                self.updateCollection(collection)
                self.renderList()
                self.activeSorting()
            }, 500)

            $('#formGame')[0].reset()
        },

        validForm: function(){
            var title =  $("#title"),
                description = $('#description'),
                txtImg = $('#txtImg');

            if( title.val() == "" || description.val() == "" || txtImg.val() == ""){
                if (title.val() == "")
                    title.parent().addClass("error")
                if (description.val() == "")
                    description.parent().addClass("error")
                if (txtImg.val() == "")
                    txtImg.parents(".input-field").addClass("error")
                return false;
            }
        },

        getNewGame: function() {
            return {
                "id" :  new Date().getUTCMilliseconds(),
                "img" : "media/" + $("#img")[0].files[0].name,
                "title" : $("#title").val(),
                "description" : $("#description").val()
            }
        },

        updateCollection: function(col) {
            localStorage.setItem('games', JSON.stringify(col));
        },


        saveImgGame: function () {
            var file_data = $('#img').prop('files')[0];
            var form_data = new FormData();                  
            form_data.append('file', file_data);                           
            $.ajax({
                url: 'upload.php', // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(php_script_response){
                    //alert(php_script_response); // display response from the PHP script, if any
                }
             });
        },
        
        showEditGame: function(){
            var idGame = $(this).parents(".game").attr("id"),
                collection = self.getCollection();

            $('label[for="title"],label[for="description"]').addClass('active')
            $("#titleForm").html("EDIT GAME")
            $("#edit").show()
            $("#add").hide()
            $("#editId").val(idGame)

            for (i in collection){
                if (collection[i].id == idGame) {
                    $("#title").val(collection[i].title)
                    $("#description").val(collection[i].description)
                    $("#txtImg").val(collection[i].img.replace("media/",""))
                }
            }
        },

        editGame: function(){
            if( self.validForm() == false)
                return false;

            var idGame = $("#editId").val(),
                collection = self.getCollection();
            
            for (i in collection){
                if (collection[i].id == idGame) {
                    collection[i].title = $("#title").val()
                    collection[i].description = $("#description").val()
                    if(collection[i].img != "media/" + $('#txtImg').val()){
                        self.saveImgGame()
                        collection[i].img = "media/" + $("#img")[0].files[0].name
                    }
                }
            }
            
            self.resetForm()
            $('#formGame')[0].reset();

            setTimeout(function(){
                self.updateCollection(collection)
                self.renderList()
                self.activeSorting()
            }, 500)
        },

        deleteGame:function(){
            var idGame = $(this).parents(".game").attr("id"),
                collection = self.getCollection();

            for (i in collection) {
                if (collection[i].id == idGame){
                    collection.splice(i, 1);
                }
            }
            
            self.updateCollection(collection)
            self.renderList()
            self.activeSorting()
        },

        resetForm: function(){
            $("#titleForm").html("ADD NEW GAME")
            $("#edit").hide()
            $("#add").show()
            $('label[for="title"],label[for="description"]').removeClass('active')
        },

        orderList: function (data, key) {
            return data.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },

        renderList: function() {

            data = self.orderList(this.getCollection(), "order"),
            dataLength = Object.keys(data).length

            $(".games-container").html(
                Mustache.to_html(_tpl, {games: data})
            )

            $('#available-games span').html(dataLength);
        }
    }
}());

games_controller.init();