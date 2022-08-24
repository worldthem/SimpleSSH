function uniqId() {
  return "id"+Math.round(new Date().getTime() + (Math.random() * 100000));
}

function return_text(types=''){
   //var mainDiv = types ==''? '<a href="#" class="sort_icon fa_move fa_small editable" onclick="return false;"></a>' :'<a href="#" class="parrentdropable fa_move fa_small editable" onclick="return false;"></a>';
   //var editBlock = types ==''? '<a href="#" class="edit_texticon fa_edit fa_small editable" data-toggle="modal" data-target="#editContainer"></a>' : '';

   return ' <div class="edit_text_this">'+
                //mainDiv+
                '<a href="#" class="'+(types ==''? 'sort_icon':'parrentdropable')+' fa_move fa_small editable" onclick="return false;"></a>'+
                '<a href="#" class="edit_texticon fa_edit fa_small editable" data-toggle="modal" data-target="#editContainer" data-typeBlock="'+(types ==''? 'child':'main')+'"></a>'+
                '<a href="#" class="dublicate fa_dublicate fa_small editable" ></a>'+
                //'<a href="#" class="options fa_options fa_small editable" ></a>'+

                '<a href="#" class="delet_text fa_delete fa_small editable" ></a>'+
            '</div>';
  }

 function getJsonData(data=''){
     try {
           return JSON.parse(data);
         } catch (e) {
          return {};
        }
 }

function undCheck(data =''){
    if (typeof data === "undefined"){
        return '';
    }else{
       return data;
    }
 }

function wch(data='',dataDefault=''){
    if (typeof data === "undefined"){
        return dataDefault;
    }else{
       return data !=''? data :dataDefault ;
    }
}

function emptyDataCheck(data=''){
    if (typeof data === "undefined"){
        return false;
    }else{
       return data !=''? true :false ;
    }
}


function parse_style(divClass = '', getD=''){
     var data = $(divClass).attr("style");
     if (typeof data === "undefined"){
        return '';
       }

     var styleArr = data.split(';')
     var returnData =  '';

     for( var i=0; i<styleArr.length; i++){
         var styleArr_inner = styleArr[i].split(':');

         if(styleArr_inner[0].trim() == getD){
            returnData = styleArr_inner[1].trim();
            break;
          }
     }

    return returnData;
}

function fixIds(elem, cntr) {
    $(elem).find("[id]").add(elem).each(function() {
        this.id = this.id.replace(/\d+$/, "unic_id") + cntr;
    })
}

function hoverOver(){
   $("#page_contents div div.inside_grid").hover(
      function() {
            $(this).append(return_text());
            $('.dropable').sortable({opacity: 0.9, cursor: 'move', connectWith: ".dropable", handle: '.sort_icon'});
            //$(this).attr("contenteditable","true");
          }, function() {
            $(this).find( ".edit_text_this" ).remove();
            //$(this).removeAttr("contenteditable");
          }
    );
}

$(function() {
       // Sortable for the divs inside sortable dropable

       $( "#page_contents" ).sortable({opacity: 0.9, cursor: 'move', connectWith: "#page_contents", handle: '.parrentdropable'});

       /* $('.dropable').disableSelection();

        // Sortable for the main dropable
        $( "#page_contents" ).sortable({opacity: 0.9, cursor: 'move'});
        $( "#page_contents" ).disableSelection();*/

        //Add editable divs for the divs insde dropable

         hoverOver();


        //Add editable divs for the dropable div
        $("#page_contents .dropable").append(return_text("options"));

       // Add new block
          $("a.add_grid").click(function(){
              var tip=$('.bootstrap_blocks').val();
              var type_is = tip != "dropable sections"? "" : "is";
              var class_inside =  tip != "dropable sections" ?  ' inside_grid':'';
              var insideContetn =  tip != "dropable sections" ? '': return_text('option');
              //var contentEditable = tip != "dropable sections" ? 'contenteditable="true"' :'';
              var content_is = '<div class="'+tip+class_inside+'" id="'+uniqId()+'">'+insideContetn+'</div>' ;

              if($('#page_contents .dropable').length){
                 if(tip != "dropable sections"){
                    if($(".selectedBlock") && $(".selectedBlock").length){
                       $("#page_contents .selectedBlock").append(content_is);
                    }else{
                       $("#page_contents .dropable:last-child").append(content_is);
                    }

                 }else{
                    $("#page_contents").append(content_is);
                 }

              }else{
                  $("#page_contents").append('<div class="dropable sectionsinside_grid" id="'+uniqId()+'">'
                                                   +content_is+
                                             '</div>');
              }

              $('.dropable').sortable({opacity: 0.6, cursor: 'move', connectWith: ".dropable"});
              hoverOver();
             return false;
         });

        // Remove div
        $( "#page_contents" ).delegate( ".delet_text", "click", function() {
            var r = confirm("Are you sure you want to remove this block?");
                  if (r == true) {
                      $(this).parent("div").parent("div").remove();
                      var this_div=$(this).parent().parent();
                      var data = getJsonData($("#css_divs").val());
                      delete data[this_div.attr('id')];
                      $("#css_divs").val(JSON.stringify(data));
                   }
                  return false;
            });


            // Dublicate div
              $( "#page_contents" ).delegate( ".dublicate", "click", function() {
                  var this_div=$(this).parent().parent();
                  var regex = /^(.+?)(\d+)$/i;
                  var clone = this_div.clone();
                  var uniqueID= uniqId();
                  var data = getJsonData($("#css_divs").val());

                  var changesWas = '';
                  var divexist = data[this_div.attr('id')] ;
                      clone.attr("id",uniqueID).find("*")
                                .each(function() {
                                    var id = this.id || "";
                                    var match = id.match(regex) || [];

                                    if (match.length == 3) {
                                         var unicId = uniqId();
                                         data[unicId] = data[this.id];
                                         this.id = unicId;
                                         changesWas = 'yes';
                                    }
                                });

                      this_div.parent().append(clone);

                     if(typeof divexist !== "undefined"){
                         data[uniqueID] = data[this_div.attr('id')];
                         changesWas = 'yes';
                      }
                      if(changesWas == 'yes'){
                           $("#css_divs").val(JSON.stringify(data));
                           generate_css();
                     }

                     hoverOver();
                   return false;
               });

           // When press edit content
           $( "#page_contents" ).delegate( ".edit_texticon", "click", function(){
                         //Reset all fields
                        $('.font_color').removeAttr("style");
                        $('.bg_color').removeAttr("style");
                        $('.rightBlockEditor').find('input').val('');
                        $('.rightBlockEditor').find('select').prop('selectedIndex',0);
                        $('.leftBlockEditor').find('input').val('');


                         var typeEdit = $(this).attr("data-typeblock");
                         var parentDiv = $(this).parent().parent();
                         var classParent = parentDiv.attr('class');
                         var parentDivID = parentDiv.attr('id');

                         $('.sizeBlock').css("display","none");

                         if(typeEdit =="child"){

                            // $('.sizeBlock').css("display","block");

                              if(chekIfInString(classParent, "col-") != null){
                                 var clName = chekIfInString(classParent, "col-");
                                     clName = clName.toString().replace("-sm-","-md-");
                                  if($(".sizeContainer option[value='"+clName+"']").length > 0){
                                     $('.sizeBlock').css("display","block");
                                    $(".sizeContainer").val(clName);
                                  }else{
                                     $('.sizeBlock').css("display","none");
                                   }


                              }


                              $('.editorBlock').css("display", "none");
                              $('.leftBlockEditor').css("display", "block");
                              $('.rightBlockEditor').removeClass("col-md-12");
                              $('.modalWindow').addClass("modal-lg-editor");
                              $("#id_precedent").val(parentDiv.attr('id'));

                              parentDiv.find('.edit_text_this').remove();

                              if(chekIfInString(classParent, "performaces") !=null){
                                $('.performanacesBlock').css("display", "block");

                                   var iconF = $( "#"+parentDivID+" .fIcon" ) && $( "#"+parentDivID+" .fIcon" ).length ? parentDiv.find(".fIcon").attr("class").match(/fa-[\w-]*\b/) : null;
                                   if(iconF !=null){
                                     $('.perfIcon').val(iconF);
                                     $('.iconContainer').html("<i class='icon_result fa "+iconF+"'></i><a href='#' class='fa_delete remove_button' onclick='return removeIcon(\".iconContainer\", \".link_edit_text\")'></a>");
                                    }

                                  var linkF = $( "#"+parentDivID+" .fLink" ) && $( "#"+parentDivID+" .fLink" ).length ? parentDiv.find(".fLink").attr("href"):"";
                                    $('.perfLink').val(linkF);
                                  var titleF = $( "#"+parentDivID+" .fLink" ) && $( "#"+parentDivID+" .fLink" ).length ? parentDiv.find(".fTitle").find("a").html() :"";
                                    $('.perfTitle').val(titleF);
                                  var descriptionF = $( "#"+parentDivID+" .fLink" ) && $( "#"+parentDivID+" .fLink" ).length ? parentDiv.find(".fDescription").html() :"";
                                    $('.perfDescription').val(descriptionF);

                              }else if(chekIfInString(classParent, "fullIframe") !=null){
                                $(".iframeData").val($( "#"+parentDivID).html());
                                $('.iframeEdit').css("display", "block");
                              } else{
                                  $('.editorContainer').css("display", "block");
                                  $(".tinimceEditor234").html(parentDiv.html());
                              }

                         } else{
                             $('.leftBlockEditor').css("display", "none");
                             $('.modalWindow').removeClass("modal-lg-editor");
                             $('.rightBlockEditor').addClass("col-md-12");
                         }


                             $("#id_parent").val(parentDivID);
                             $(".div_class").val(parentDiv.attr('class'));

                            //this is for the button hide on mobile,
                            //if parent classes contain class mobileHide than check the checkbox if not than uncheck
                            if(parentDiv.attr('class').includes("mobileHide")){
                                $('.hideOnMobileOption').prop( "checked", true );
                            }else{
                                $('.hideOnMobileOption').prop( "checked", false );
                            }
                            if(parentDiv.attr('class').includes("desktopHide")){
                                $('.hideOnDesktopOption').prop( "checked", true );
                            }else{
                                $('.hideOnDesktopOption').prop( "checked", false );
                            }

                         var data = getJsonData($("#css_divs").val());
                             data = data[parentDivID];
                         if (typeof data === "undefined"){
                               $(".bg_image").attr("src", "");
                          }else{
                              $(".paddingt").val(undCheck(data.paddingt));
                              $(".paddingb").val(undCheck(data.paddingb));
                              $(".paddingl").val(undCheck(data.paddingl));
                              $(".paddingr").val(undCheck(data.paddingr));
                              $(".font_color").val(undCheck(data.font_color));
                              $(".bg_color").val(undCheck(data.bg_color));
                              $(".bg_image").attr("src",undCheck(data.bg_image));
                              $('.bg_type option[value="'+undCheck(data.bg_type)+'"]').prop('selected', true);
                              $('.bg_opacity option[value="'+undCheck(data.bg_opacity)+'"]').prop('selected', true);
                          }


                 //return false;
          });


          //Update the content for editable divs
           $( ".main_container" ).delegate( "#save_button", "click", function() {
                   var content =  tinyMCE.activeEditor.getContent();
                   var data_unic = document.getElementById('id_precedent').value ;
                   $("#"+data_unic).html(return_text()+content);
                   $(".editor").hide(200);

                  // var styleDiv = $(".insideFontColor").val() != '' ? 'color:'+$(".insideFontColor").val()+';': '';
                  //     styleDiv = $(".insideBgColor").val() != '' ? styleDiv + 'background:'+$(".insideBgColor").val()+';': styleDiv;
                   // $("#"+data_unic).attr('style', styleDiv);

                    //$("#"+data_unic).attr('class', $(".insideClass").val());


                   return false;
              });

          // close the popup
          $( ".main_container" ).delegate( ".closs_editor", "click", function() {
               $(".editor").hide(200);
               $(".options_windows").hide(200);
               return false;
           });


           // Save data
           $(".updateFormPage").submit(function() {
              $("#page_contents .edit_text_this").remove();
              var content_save = $('#page_contents').html();
               $('#editor_save').val(content_save);
             return true;
           });


              //Update options for .dropable(main container) options
            $( ".update_options" ).click(function(){
                   var data_unic = document.getElementById('id_parent').value ;
                   var classParent = $(".div_class").val();

                   var array_create =   {paddingt : $(".paddingt").val(),
                                         paddingb : $(".paddingb").val(),
                                         paddingl : $(".paddingl").val(),
                                         paddingr : $(".paddingr").val(),
                                         bg_color: $(".bg_color").val(),
                                         bg_image: $(".bg_image").attr("src"),
                                         bg_type: $(".bg_type").val(),
                                         font_color: $(".font_color").val(),
                                         bg_opacity: $(".bg_opacity").val()
                                         } ;

                    var data = getJsonData($("#css_divs").val());
                        data[data_unic] = array_create;

                      $("#css_divs").val(JSON.stringify(data));

                       var sizeClass = chekIfInString(classParent, "col-");
                        if(classParent.toString().includes("col-sm-") || classParent.toString().includes("col-md-")){
                           var sizeSeted = $(".sizeContainer").val();
                           var findAndReplaceClName = sizeClass.toString().includes("-sm-") ? sizeSeted.toString().replace("md","sm"): sizeSeted;
                           $("#"+data_unic).attr('class', classParent.replace(sizeClass, findAndReplaceClName));
                        }else{
                           $("#"+data_unic).attr('class', classParent);
                          }
                      generate_css();
                     $("#editContainer").modal('hide');

                if(!classParent.includes("dropable")){
                    var parentDivID = data_unic;
                    var parentDiv = $("#"+parentDivID);


                    if(chekIfInString(classParent, "performaces") !=null){
                           var iconF = $( "#"+parentDivID+" .fIcon") && $( "#"+data_unic+" .fIcon" ).length ? parentDiv.find(".fIcon").attr("class").match(/fa-[\w-]*\b/) : null;

                           if(iconF !=null){
                             $( "#"+parentDivID+" .fIcon").removeClass(iconF).addClass($('.perfIcon').val());
                            }

                           if($( "#"+parentDivID+" .fLink" ) && $( "#"+parentDivID+" .fLink" ).length){
                                var linkData = $('.perfLink').val();
                                if(linkData=="#" || linkData ==""){
                                   parentDiv.find(".fLink").attr("onclick","return false;");
                                }else{
                                   parentDiv.find(".fLink").removeAttr("onclick");
                                }
                                parentDiv.find(".fLink").attr("href", linkData);
                            }

                           $( "#"+parentDivID+" .fTitle" ) && $( "#"+parentDivID+" .fTitle" ).length ? parentDiv.find(".fTitle").find("a").html($('.perfTitle').val()) :"";
                           $( "#"+parentDivID+" .fDescription" ) && $( "#"+parentDivID+" .fDescription" ).length ? parentDiv.find(".fDescription").html($('.perfDescription').val()) :"";

                     }else if(chekIfInString(classParent, "fullIframe") !=null){
                          $("#"+parentDivID).html( $(".iframeData").val());
                     }else{
                        $("#"+parentDivID).html($(".tinimceEditor234" ).html());
                    }
                  }

                   return false;
              });

              //Remove image
            $('.remove_image').click(function(){
               $('.bg_image').attr("src","");
               return false;
            });

              // Select color
          $('.bg_color, .font_color, .insideBgColor, .insideFontColor').ColorPicker({
            	onSubmit: function(hsb, hex, rgb, el) {
            	    $(el).val('#' + hex);
            		$(el).ColorPickerHide();
            	},
            	onBeforeShow: function () {
            	    $(this).ColorPickerSetColor(this.value);
            	},
                onChange: function ( hsb, hex, rgb, el) {
                	     $(el).val('#' + hex);
                         $(el).css('backgroundColor', '#' + hex);
                      }
            })
            .bind('keyup', function(){
            	$(this).ColorPickerSetColor(this.value);
             });


            //add ready content
           // $('.block_list').click(function(){
              $( ".blockListPage" ).delegate( ".block_list", "click", function(){

              var mainID = uniqId();
              var dataClass =  $(this).attr("data-class");
              var additionalStyle = $(".style"+dataClass).val();
              var html_code= $("."+dataClass).val().replace(/unic_id/g , function() {
                              return uniqId();
                            });


                html_code =  html_code.replace('main_id', mainID);

               $("#page_contents").append(html_code);

               if(additionalStyle != ""){
                  var data = getJsonData($("#css_divs").val());
                      data[mainID] = getJsonData(additionalStyle);
                      $("#css_divs").val(JSON.stringify(data));
                      generate_css();
                 }


               $("#page_contents .edit_text_this").remove();
              // $("#page_contents div div").attr("contenteditable","true");
               //$("#page_contents div div").append(return_text());
               //Add editable divs for the dropable div
                $("#page_contents .dropable").append(return_text("options"));
                hoverOver();
               return false;
            });


        $(".shortCodeModal").click(function(){
          $(".shortCodeWind").show();
               $.ajax({
                    type:"GET",
                    url: url_website+"/admin/pageShortcode",
                    success: function (data) {
                         result_is = data;
                         if(data=="done"){
                            $("#loading").html('<img src="'+url_resources+'admin_assets/img/active.png" />');
                          }
                      },
                    complete: function() {
                         if(result_is=="continue"){
                              setInterval(load_images, 2000);
                         }else{
                              clearInterval(load_images);
                          }
                      }

                   });

          //$(".shortCodesList").
           return false;
        });

        $(".cssModal").click(function(){
          $(".css_editor").show();
           return false;
         });

         $(".update_css").click(function(){
               $("#directCSS").html($("#cssDirect").val());
               $(".css_editor").hide();
             return false;
         });

 generate_css();

 $('#icons_list a').on('click',  function(event){
         var icon_class = $(this).data("icon");
           $(".link_edit_text").val(icon_class);
           $(".iconContainer").html("<i class='icon_result fa "+icon_class+"'></i><a href='#' class='fa_delete remove_button' onclick='return removeIcon(\".iconContainer\", \".link_edit_text\")'></a>");
           $('#load_icons_modal').modal('hide');
            closeModalIcons();
          return false;
      });

  $('#load_icons_modal .close').on('click',  function(event){
         closeModalIcons();
   });

  $( "#page_contents" ).delegate( ".sections", "click", function() {
     if(chekIfInString($(this).attr("class"), "selectedBlock") == null){
        $('.sections').removeClass("selectedBlock");
        $(this).addClass("selectedBlock");
       }
   });


      $('#load_ajax_modal .close').on('click',  function(event){
          closeModalIcons();
      });

    //Set options hide on mobile
    $('.hideOnMobileOption').click(function(){
        var classesDiv = $('.div_class').val();
        if($(this).is(':checked')){
            if(!classesDiv.includes("mobileHide")){
                $('.div_class').val(classesDiv+" mobileHide");
            }
        }else{
            $('.div_class').val(classesDiv.replace('mobileHide','').trim());

        }
    });

   //Set options hide on desktop
    $('.hideOnDesktopOption').click(function(){
        var classesDiv = $('.div_class').val();
        if($(this).is(':checked')){
            if(!classesDiv.includes("desktopHide")){
                $('.div_class').val(classesDiv+" desktopHide");
            }
        }else{
            $('.div_class').val(classesDiv.replace('desktopHide','').trim());

        }
    });
});
// find in string word
function chekIfInString(str, patt){
    var rgxp = new RegExp(patt+"[\\w-]*\\b");
  return str.match(rgxp); // /matchIs[\w-]*\b/
}



// Generate css

function generate_css(){
  var data = getJsonData($("#css_divs").val());
  var cssText = "";
  for (var key in data) {
    // skip loop if the property is from prototype
    if (!data.hasOwnProperty(key)) continue;
     var obj = data[key];
      cssText = cssText + "#page_contents #"+key+",#page_contents #"+key+" a , #page_contents #"+key+" p {color:"+obj.font_color+";}";

      cssText = cssText + "#page_contents #"+key+"{ ";


        //cssText = undCheck(obj.bg_padding) !="" ? cssText + "padding-top:"+obj.bg_padding+"px;padding-bottom:"+obj.bg_padding+"px;" : cssText;
        cssText =cssText + (emptyDataCheck(obj.paddingt) ? "padding-top:"+wch(obj.paddingt,'')+"px;": "");
        cssText =cssText + (emptyDataCheck(obj.paddingr) ? "padding-right:"+wch(obj.paddingr,'')+"px;": "");
        cssText =cssText + (emptyDataCheck(obj.paddingb) ? "padding-bottom:"+wch(obj.paddingb,'')+"px;": "");
        cssText =cssText + (emptyDataCheck(obj.paddingl) ? "padding-left:"+wch(obj.paddingl,'')+"px;": "");
        alert
        //cssText =  cssText + "padding:"+wch(obj.paddingt,'20')+"px "+wch(obj.paddingr,'15')+"px "+wch(obj.paddingb,'20')+"px "+wch(obj.paddingl,'15')+"px;" ;

        cssText = undCheck(obj.bg_image) !="" ? cssText +  "background-image: url('"+obj.bg_image+"');" : cssText;
        cssText = undCheck(obj.bg_type) == "fixed" ? cssText +  "background-attachment: fixed;" : cssText;
      cssText = cssText + "} ";


      cssText = cssText + "#page_contents #"+key+":before {display:block;";
         cssText = undCheck(obj.bg_color) !="" ? cssText + "background:"+obj.bg_color+";" : cssText;
         cssText = undCheck(obj.bg_opacity) !="" ? cssText + "opacity:"+obj.bg_opacity+";" : cssText;
      cssText = cssText + "}";

      cssText = undCheck(obj.fullcss) !="" ? cssText +  obj.fullcss : cssText;
  }


  $('#css_done').html(cssText);
}  