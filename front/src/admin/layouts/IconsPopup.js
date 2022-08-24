import React, { useState } from 'react';

class  IconsPopup extends React.Component{

 constructor(props) {
     super(props);

      this.state={
           showIcon:"none",
           css:"",
       }
   }

 componentDidMount(){
   var popup = document.getElementsByClassName('showFaIconPopup');

   if(popup.length>0){
       for(var i=0;i<popup.length;i++)
        popup[i].addEventListener( 'click', (event) => this.itemClick(event),  false );
    }
 }

 itemClick=(e)=>{
   e.preventDefault();
   this.setState({showIcon:"block",
                  css:`body{ overflow: hidden; }`
            });
 }

 closePopup =(e)=>{
     e.preventDefault();
    this.setState({showIcon:"none",
                   css:``});
 }

 search=(e)=>{
     var value = e.target.value.toLowerCase();
     var iconsListContainer = document.getElementById('load_ajax_modal_icon');
     var iconsList =iconsListContainer.getElementsByClassName('col-sm-4');

     for (var i = 0; i < iconsList.length; i++) {
       if(iconsList[i].textContent.toLowerCase().indexOf(value) > -1){
            iconsList[i].style.display="inline-table";
       }else{
            iconsList[i].style.display="none";
       }
     }
 }

 render(){
  return(
  <>
   <a href="#" class="showFaIconPopup" style={{display:"none"}}>aaaa </a>
   <a href="#" id="closeFaIconPopup" onClick={this.closePopup} style={{display:"none"}}>aaaa </a>

   <style type="text/css">{this.state.css}</style>
   <div class="modal fade in bs-example-modal-lg" tabindex="-1" id="load_ajax_modal_icon" role="dialog" style={{display:this.state.showIcon, overflow:"auto"}}>
       <div class="modal-dialog modal-lg" role="document">
           <div class="modal-content">
               <div class="modal-header">
                   <button type="button" class="close" onClick={this.closePopup} data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                   <input type="text" id="search-input" class="form-control" onKeyUp={this.search} placeholder="cat, dog, car, truck, basket, sort, spin, futbol,.... " title="Type in a name" />
               </div>
               <div class="modal_load_contentIcon">
                   <div class="col-md-12">
                       <div id="icons_list" class="">
                           <input type="hidden" value="" class="icon_class" />
                           <input type="hidden" value="" class="icon_after" />
                           <section id="web-application">
                               <h2 class="page-header">Web Application Icons</h2>
                               <div class="row fontawesome-icon-list">
                                   <a href="#" data-icon="fa-ad" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ad"></i> ad</a>
                                   <a href="#" data-icon="fa-address-book" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-address-book"></i> address-book</a>
                                   <a href="#" data-icon="fa-address-card" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-address-card"></i> address-card</a>
                                   <a href="#" data-icon="fa-adjust" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-adjust"></i> adjust</a>
                                   <a href="#" data-icon="fa-air-freshener" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-air-freshener"></i> air-freshener</a>
                                   <a href="#" data-icon="fa-align-center" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-align-center"></i> align-center</a>
                                   <a href="#" data-icon="fa-align-justify" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-align-justify"></i> align-justify</a>
                                   <a href="#" data-icon="fa-align-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-align-left"></i> align-left</a>
                                   <a href="#" data-icon="fa-align-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-align-right"></i> align-right</a>
                                   <a href="#" data-icon="fa-allergies" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-allergies"></i> allergies</a>
                                   <a href="#" data-icon="fa-ambulance" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ambulance"></i> ambulance</a>
                                   <a href="#" data-icon="fa-american-sign-language-interpreting" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-american-sign-language-interpreting"></i> american-sign-language-interpreting</a>
                                   <a href="#" data-icon="fa-anchor" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-anchor"></i> anchor</a>
                                   <a href="#" data-icon="fa-angle-double-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-double-down"></i> angle-double-down</a>
                                   <a href="#" data-icon="fa-angle-double-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-double-left"></i> angle-double-left</a>
                                   <a href="#" data-icon="fa-angle-double-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-double-right"></i> angle-double-right</a>
                                   <a href="#" data-icon="fa-angle-double-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-double-up"></i> angle-double-up</a>
                                   <a href="#" data-icon="fa-angle-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-down"></i> angle-down</a>
                                   <a href="#" data-icon="fa-angle-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-left"></i> angle-left</a>
                                   <a href="#" data-icon="fa-angle-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-right"></i> angle-right</a>
                                   <a href="#" data-icon="fa-angle-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angle-up"></i> angle-up</a>
                                   <a href="#" data-icon="fa-angry" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-angry"></i> angry</a>
                                   <a href="#" data-icon="fa-ankh" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ankh"></i> ankh</a>
                                   <a href="#" data-icon="fa-apple-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-apple-alt"></i> apple-alt</a>
                                   <a href="#" data-icon="fa-archive" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-archive"></i> archive</a>
                                   <a href="#" data-icon="fa-archway" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-archway"></i> archway</a>
                                   <a href="#" data-icon="fa-arrow-alt-circle-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-alt-circle-down"></i> arrow-alt-circle-down</a>
                                   <a href="#" data-icon="fa-arrow-alt-circle-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-alt-circle-left"></i> arrow-alt-circle-left</a>
                                   <a href="#" data-icon="fa-arrow-alt-circle-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-alt-circle-right"></i> arrow-alt-circle-right</a>
                                   <a href="#" data-icon="fa-arrow-alt-circle-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-alt-circle-up"></i> arrow-alt-circle-up</a>
                                   <a href="#" data-icon="fa-arrow-circle-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-circle-down"></i> arrow-circle-down</a>
                                   <a href="#" data-icon="fa-arrow-circle-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-circle-left"></i> arrow-circle-left</a>
                                   <a href="#" data-icon="fa-arrow-circle-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-circle-right"></i> arrow-circle-right</a>
                                   <a href="#" data-icon="fa-arrow-circle-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-circle-up"></i> arrow-circle-up</a>
                                   <a href="#" data-icon="fa-arrow-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-down"></i> arrow-down</a>
                                   <a href="#" data-icon="fa-arrow-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-left"></i> arrow-left</a>
                                   <a href="#" data-icon="fa-arrow-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-right"></i> arrow-right</a>
                                   <a href="#" data-icon="fa-arrow-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrow-up"></i> arrow-up</a>
                                   <a href="#" data-icon="fa-arrows-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrows-alt"></i> arrows-alt</a>
                                   <a href="#" data-icon="fa-arrows-alt-h" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrows-alt-h"></i> arrows-alt-h</a>
                                   <a href="#" data-icon="fa-arrows-alt-v" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-arrows-alt-v"></i> arrows-alt-v</a>
                                   <a href="#" data-icon="fa-assistive-listening-systems" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-assistive-listening-systems"></i> assistive-listening-systems</a>
                                   <a href="#" data-icon="fa-asterisk" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-asterisk"></i> asterisk</a>
                                   <a href="#" data-icon="fa-at" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-at"></i> at</a><a href="#" data-icon="fa-atlas" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-atlas"></i> atlas</a>
                                   <a href="#" data-icon="fa-atom" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-atom"></i> atom</a>
                                   <a href="#" data-icon="fa-audio-description" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-audio-description"></i> audio-description</a>
                                   <a href="#" data-icon="fa-award" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-award"></i> award</a>
                                   <a href="#" data-icon="fa-baby" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-baby"></i> baby</a>
                                   <a href="#" data-icon="fa-baby-carriage" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-baby-carriage"></i> baby-carriage</a>
                                   <a href="#" data-icon="fa-backspace" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-backspace"></i> backspace</a>
                                   <a href="#" data-icon="fa-backward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-backward"></i> backward</a>
                                   <a href="#" data-icon="fa-bacon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bacon"></i> bacon</a>
                                   <a href="#" data-icon="fa-bacteria" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bacteria"></i> bacteria</a>
                                   <a href="#" data-icon="fa-bacterium" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bacterium"></i> bacterium</a>
                                   <a href="#" data-icon="fa-bahai" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bahai"></i> bahai</a>
                                   <a href="#" data-icon="fa-balance-scale" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-balance-scale"></i> balance-scale</a>
                                   <a href="#" data-icon="fa-balance-scale-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-balance-scale-left"></i> balance-scale-left</a>
                                   <a href="#" data-icon="fa-balance-scale-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-balance-scale-right"></i> balance-scale-right</a>
                                   <a href="#" data-icon="fa-ban" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ban"></i> ban</a>
                                   <a href="#" data-icon="fa-band-aid" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-band-aid"></i> band-aid</a>
                                   <a href="#" data-icon="fa-barcode" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-barcode"></i> barcode</a>
                                   <a href="#" data-icon="fa-bars" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bars"></i> bars</a>
                                   <a href="#" data-icon="fa-baseball-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-baseball-ball"></i> baseball-ball</a>
                                   <a href="#" data-icon="fa-basketball-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-basketball-ball"></i> basketball-ball</a>
                                   <a href="#" data-icon="fa-bath" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bath"></i> bath</a>
                                   <a href="#" data-icon="fa-battery-empty" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-battery-empty"></i> battery-empty</a>
                                   <a href="#" data-icon="fa-battery-full" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-battery-full"></i> battery-full</a>
                                   <a href="#" data-icon="fa-battery-half" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-battery-half"></i> battery-half</a>
                                   <a href="#" data-icon="fa-battery-quarter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-battery-quarter"></i> battery-quarter</a>
                                   <a href="#" data-icon="fa-battery-three-quarters" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-battery-three-quarters"></i> battery-three-quarters</a>
                                   <a href="#" data-icon="fa-bed" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bed"></i> bed</a><a href="#" data-icon="fa-beer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-beer"></i> beer</a>
                                   <a href="#" data-icon="fa-bell" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bell"></i> bell</a>
                                   <a href="#" data-icon="fa-bell-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bell-slash"></i> bell-slash</a>
                                   <a href="#" data-icon="fa-bezier-curve" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bezier-curve"></i> bezier-curve</a>
                                   <a href="#" data-icon="fa-bible" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bible"></i> bible</a>
                                   <a href="#" data-icon="fa-bicycle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bicycle"></i> bicycle</a>
                                   <a href="#" data-icon="fa-biking" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-biking"></i> biking</a>
                                   <a href="#" data-icon="fa-binoculars" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-binoculars"></i> binoculars</a>
                                   <a href="#" data-icon="fa-biohazard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-biohazard"></i> biohazard</a>
                                   <a href="#" data-icon="fa-birthday-cake" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-birthday-cake"></i> birthday-cake</a>
                                   <a href="#" data-icon="fa-blender" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-blender"></i> blender</a>
                                   <a href="#" data-icon="fa-blender-phone" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-blender-phone"></i> blender-phone</a>
                                   <a href="#" data-icon="fa-blind" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-blind"></i> blind</a>
                                   <a href="#" data-icon="fa-blog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-blog"></i> blog</a><a href="#" data-icon="fa-bold" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bold"></i> bold</a>
                                   <a href="#" data-icon="fa-bolt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bolt"></i> bolt</a><a href="#" data-icon="fa-bomb" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bomb"></i> bomb</a>
                                   <a href="#" data-icon="fa-bone" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bone"></i> bone</a><a href="#" data-icon="fa-bong" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bong"></i> bong</a>
                                   <a href="#" data-icon="fa-book" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-book"></i> book</a>
                                   <a href="#" data-icon="fa-book-dead" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-book-dead"></i> book-dead</a>
                                   <a href="#" data-icon="fa-book-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-book-medical"></i> book-medical</a>
                                   <a href="#" data-icon="fa-book-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-book-open"></i> book-open</a>
                                   <a href="#" data-icon="fa-book-reader" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-book-reader"></i> book-reader</a>
                                   <a href="#" data-icon="fa-bookmark" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bookmark"></i> bookmark</a>
                                   <a href="#" data-icon="fa-border-all" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-border-all"></i> border-all</a>
                                   <a href="#" data-icon="fa-border-none" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-border-none"></i> border-none</a>
                                   <a href="#" data-icon="fa-border-style" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-border-style"></i> border-style</a>
                                   <a href="#" data-icon="fa-bowling-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bowling-ball"></i> bowling-ball</a>
                                   <a href="#" data-icon="fa-box" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-box"></i> box</a>
                                   <a href="#" data-icon="fa-box-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-box-open"></i> box-open</a>
                                   <a href="#" data-icon="fa-box-tissue" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-box-tissue"></i> box-tissue</a>
                                   <a href="#" data-icon="fa-boxes" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-boxes"></i> boxes</a>
                                   <a href="#" data-icon="fa-braille" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-braille"></i> braille</a>
                                   <a href="#" data-icon="fa-brain" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-brain"></i> brain</a>
                                   <a href="#" data-icon="fa-bread-slice" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bread-slice"></i> bread-slice</a>
                                   <a href="#" data-icon="fa-briefcase" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-briefcase"></i> briefcase</a>
                                   <a href="#" data-icon="fa-briefcase-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-briefcase-medical"></i> briefcase-medical</a>
                                   <a href="#" data-icon="fa-broadcast-tower" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-broadcast-tower"></i> broadcast-tower</a>
                                   <a href="#" data-icon="fa-broom" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-broom"></i> broom</a>
                                   <a href="#" data-icon="fa-brush" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-brush"></i> brush</a><a href="#" data-icon="fa-bug" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bug"></i> bug</a>
                                   <a href="#" data-icon="fa-building" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-building"></i> building</a>
                                   <a href="#" data-icon="fa-bullhorn" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bullhorn"></i> bullhorn</a>
                                   <a href="#" data-icon="fa-bullseye" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bullseye"></i> bullseye</a>
                                   <a href="#" data-icon="fa-burn" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-burn"></i> burn</a><a href="#" data-icon="fa-bus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bus"></i> bus</a>
                                   <a href="#" data-icon="fa-bus-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-bus-alt"></i> bus-alt</a>
                                   <a href="#" data-icon="fa-business-time" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-business-time"></i> business-time</a>
                                   <a href="#" data-icon="fa-calculator" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calculator"></i> calculator</a>
                                   <a href="#" data-icon="fa-calendar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar"></i> calendar</a>
                                   <a href="#" data-icon="fa-calendar-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-alt"></i> calendar-alt</a>
                                   <a href="#" data-icon="fa-calendar-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-check"></i> calendar-check</a>
                                   <a href="#" data-icon="fa-calendar-day" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-day"></i> calendar-day</a>
                                   <a href="#" data-icon="fa-calendar-minus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-minus"></i> calendar-minus</a>
                                   <a href="#" data-icon="fa-calendar-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-plus"></i> calendar-plus</a>
                                   <a href="#" data-icon="fa-calendar-times" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-times"></i> calendar-times</a>
                                   <a href="#" data-icon="fa-calendar-week" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-calendar-week"></i> calendar-week</a>
                                   <a href="#" data-icon="fa-camera" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-camera"></i> camera</a>
                                   <a href="#" data-icon="fa-camera-retro" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-camera-retro"></i> camera-retro</a>
                                   <a href="#" data-icon="fa-campground" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-campground"></i> campground</a>
                                   <a href="#" data-icon="fa-candy-cane" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-candy-cane"></i> candy-cane</a>
                                   <a href="#" data-icon="fa-cannabis" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cannabis"></i> cannabis</a>
                                   <a href="#" data-icon="fa-capsules" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-capsules"></i> capsules</a>
                                   <a href="#" data-icon="fa-car" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-car"></i> car</a>
                                   <a href="#" data-icon="fa-car-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-car-alt"></i> car-alt</a>
                                   <a href="#" data-icon="fa-car-battery" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-car-battery"></i> car-battery</a>
                                   <a href="#" data-icon="fa-car-crash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-car-crash"></i> car-crash</a>
                                   <a href="#" data-icon="fa-car-side" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-car-side"></i> car-side</a>
                                   <a href="#" data-icon="fa-caravan" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caravan"></i> caravan</a>
                                   <a href="#" data-icon="fa-caret-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-down"></i> caret-down</a>
                                   <a href="#" data-icon="fa-caret-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-left"></i> caret-left</a>
                                   <a href="#" data-icon="fa-caret-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-right"></i> caret-right</a>
                                   <a href="#" data-icon="fa-caret-square-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-square-down"></i> caret-square-down</a>
                                   <a href="#" data-icon="fa-caret-square-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-square-left"></i> caret-square-left</a>
                                   <a href="#" data-icon="fa-caret-square-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-square-right"></i> caret-square-right</a>
                                   <a href="#" data-icon="fa-caret-square-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-square-up"></i> caret-square-up</a>
                                   <a href="#" data-icon="fa-caret-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-caret-up"></i> caret-up</a>
                                   <a href="#" data-icon="fa-carrot" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-carrot"></i> carrot</a>
                                   <a href="#" data-icon="fa-cart-arrow-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cart-arrow-down"></i> cart-arrow-down</a>
                                   <a href="#" data-icon="fa-cart-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cart-plus"></i> cart-plus</a>
                                   <a href="#" data-icon="fa-cash-register" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cash-register"></i> cash-register</a>
                                   <a href="#" data-icon="fa-cat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cat"></i> cat</a>
                                   <a href="#" data-icon="fa-certificate" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-certificate"></i> certificate</a>
                                   <a href="#" data-icon="fa-chair" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chair"></i> chair</a>
                                   <a href="#" data-icon="fa-chalkboard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chalkboard"></i> chalkboard</a>
                                   <a href="#" data-icon="fa-chalkboard-teacher" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chalkboard-teacher"></i> chalkboard-teacher</a>
                                   <a href="#" data-icon="fa-charging-station" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-charging-station"></i> charging-station</a>
                                   <a href="#" data-icon="fa-chart-area" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chart-area"></i> chart-area</a>
                                   <a href="#" data-icon="fa-chart-bar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chart-bar"></i> chart-bar</a>
                                   <a href="#" data-icon="fa-chart-line" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chart-line"></i> chart-line</a>
                                   <a href="#" data-icon="fa-chart-pie" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chart-pie"></i> chart-pie</a>
                                   <a href="#" data-icon="fa-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-check"></i> check</a>
                                   <a href="#" data-icon="fa-check-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-check-circle"></i> check-circle</a>
                                   <a href="#" data-icon="fa-check-double" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-check-double"></i> check-double</a>
                                   <a href="#" data-icon="fa-check-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-check-square"></i> check-square</a>
                                   <a href="#" data-icon="fa-cheese" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cheese"></i> cheese</a>
                                   <a href="#" data-icon="fa-chess" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess"></i> chess</a>
                                   <a href="#" data-icon="fa-chess-bishop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-bishop"></i> chess-bishop</a>
                                   <a href="#" data-icon="fa-chess-board" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-board"></i> chess-board</a>
                                   <a href="#" data-icon="fa-chess-king" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-king"></i> chess-king</a>
                                   <a href="#" data-icon="fa-chess-knight" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-knight"></i> chess-knight</a>
                                   <a href="#" data-icon="fa-chess-pawn" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-pawn"></i> chess-pawn</a>
                                   <a href="#" data-icon="fa-chess-queen" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-queen"></i> chess-queen</a>
                                   <a href="#" data-icon="fa-chess-rook" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chess-rook"></i> chess-rook</a>
                                   <a href="#" data-icon="fa-chevron-circle-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-circle-down"></i> chevron-circle-down</a>
                                   <a href="#" data-icon="fa-chevron-circle-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-circle-left"></i> chevron-circle-left</a>
                                   <a href="#" data-icon="fa-chevron-circle-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-circle-right"></i> chevron-circle-right</a>
                                   <a href="#" data-icon="fa-chevron-circle-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-circle-up"></i> chevron-circle-up</a>
                                   <a href="#" data-icon="fa-chevron-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-down"></i> chevron-down</a>
                                   <a href="#" data-icon="fa-chevron-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-left"></i> chevron-left</a>
                                   <a href="#" data-icon="fa-chevron-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-right"></i> chevron-right</a>
                                   <a href="#" data-icon="fa-chevron-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-chevron-up"></i> chevron-up</a>
                                   <a href="#" data-icon="fa-child" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-child"></i> child</a>
                                   <a href="#" data-icon="fa-church" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-church"></i> church</a>
                                   <a href="#" data-icon="fa-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-circle"></i> circle</a>
                                   <a href="#" data-icon="fa-circle-notch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-circle-notch"></i> circle-notch</a>
                                   <a href="#" data-icon="fa-city" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-city"></i> city</a>
                                   <a href="#" data-icon="fa-clinic-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clinic-medical"></i> clinic-medical</a>
                                   <a href="#" data-icon="fa-clipboard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clipboard"></i> clipboard</a>
                                   <a href="#" data-icon="fa-clipboard-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clipboard-check"></i> clipboard-check</a>
                                   <a href="#" data-icon="fa-clipboard-list" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clipboard-list"></i> clipboard-list</a>
                                   <a href="#" data-icon="fa-clock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clock"></i> clock</a>
                                   <a href="#" data-icon="fa-clone" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-clone"></i> clone</a>
                                   <a href="#" data-icon="fa-closed-captioning" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-closed-captioning"></i> closed-captioning</a>
                                   <a href="#" data-icon="fa-cloud" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud"></i> cloud</a>
                                   <a href="#" data-icon="fa-cloud-download-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-download-alt"></i> cloud-download-alt</a>
                                   <a href="#" data-icon="fa-cloud-meatball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-meatball"></i> cloud-meatball</a>
                                   <a href="#" data-icon="fa-cloud-moon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-moon"></i> cloud-moon</a>
                                   <a href="#" data-icon="fa-cloud-moon-rain" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-moon-rain"></i> cloud-moon-rain</a>
                                   <a href="#" data-icon="fa-cloud-rain" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-rain"></i> cloud-rain</a>
                                   <a href="#" data-icon="fa-cloud-showers-heavy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-showers-heavy"></i> cloud-showers-heavy</a>
                                   <a href="#" data-icon="fa-cloud-sun" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-sun"></i> cloud-sun</a>
                                   <a href="#" data-icon="fa-cloud-sun-rain" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-sun-rain"></i> cloud-sun-rain</a>
                                   <a href="#" data-icon="fa-cloud-upload-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cloud-upload-alt"></i> cloud-upload-alt</a>
                                   <a href="#" data-icon="fa-cocktail" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cocktail"></i> cocktail</a>
                                   <a href="#" data-icon="fa-code" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-code"></i> code</a>
                                   <a href="#" data-icon="fa-code-branch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-code-branch"></i> code-branch</a>
                                   <a href="#" data-icon="fa-coffee" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-coffee"></i> coffee</a>
                                   <a href="#" data-icon="fa-cog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cog"></i> cog</a><a href="#" data-icon="fa-cogs" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cogs"></i> cogs</a>
                                   <a href="#" data-icon="fa-coins" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-coins"></i> coins</a>
                                   <a href="#" data-icon="fa-columns" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-columns"></i> columns</a>
                                   <a href="#" data-icon="fa-comment" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment"></i> comment</a>
                                   <a href="#" data-icon="fa-comment-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment-alt"></i> comment-alt</a>
                                   <a href="#" data-icon="fa-comment-dollar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment-dollar"></i> comment-dollar</a>
                                   <a href="#" data-icon="fa-comment-dots" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment-dots"></i> comment-dots</a>
                                   <a href="#" data-icon="fa-comment-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment-medical"></i> comment-medical</a>
                                   <a href="#" data-icon="fa-comment-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comment-slash"></i> comment-slash</a>
                                   <a href="#" data-icon="fa-comments" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comments"></i> comments</a>
                                   <a href="#" data-icon="fa-comments-dollar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-comments-dollar"></i> comments-dollar</a>
                                   <a href="#" data-icon="fa-compact-disc" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-compact-disc"></i> compact-disc</a>
                                   <a href="#" data-icon="fa-compass" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-compass"></i> compass</a>
                                   <a href="#" data-icon="fa-compress" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-compress"></i> compress</a>
                                   <a href="#" data-icon="fa-compress-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-compress-alt"></i> compress-alt</a>
                                   <a href="#" data-icon="fa-compress-arrows-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-compress-arrows-alt"></i> compress-arrows-alt</a>
                                   <a href="#" data-icon="fa-concierge-bell" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-concierge-bell"></i> concierge-bell</a>
                                   <a href="#" data-icon="fa-cookie" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cookie"></i> cookie</a>
                                   <a href="#" data-icon="fa-cookie-bite" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cookie-bite"></i> cookie-bite</a>
                                   <a href="#" data-icon="fa-copy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-copy"></i> copy</a>
                                   <a href="#" data-icon="fa-copyright" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-copyright"></i> copyright</a>
                                   <a href="#" data-icon="fa-couch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-couch"></i> couch</a>
                                   <a href="#" data-icon="fa-credit-card" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-credit-card"></i> credit-card</a>
                                   <a href="#" data-icon="fa-crop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crop"></i> crop</a>
                                   <a href="#" data-icon="fa-crop-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crop-alt"></i> crop-alt</a>
                                   <a href="#" data-icon="fa-cross" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cross"></i> cross</a>
                                   <a href="#" data-icon="fa-crosshairs" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crosshairs"></i> crosshairs</a>
                                   <a href="#" data-icon="fa-crow" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crow"></i> crow</a>
                                   <a href="#" data-icon="fa-crown" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crown"></i> crown</a>
                                   <a href="#" data-icon="fa-crutch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-crutch"></i> crutch</a>
                                   <a href="#" data-icon="fa-cube" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cube"></i> cube</a>
                                   <a href="#" data-icon="fa-cubes" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cubes"></i> cubes</a><a href="#" data-icon="fa-cut" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-cut"></i> cut</a>
                                   <a href="#" data-icon="fa-database" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-database"></i> database</a>
                                   <a href="#" data-icon="fa-deaf" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-deaf"></i> deaf</a>
                                   <a href="#" data-icon="fa-democrat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-democrat"></i> democrat</a>
                                   <a href="#" data-icon="fa-desktop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-desktop"></i> desktop</a>
                                   <a href="#" data-icon="fa-dharmachakra" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dharmachakra"></i> dharmachakra</a>
                                   <a href="#" data-icon="fa-diagnoses" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-diagnoses"></i> diagnoses</a>
                                   <a href="#" data-icon="fa-dice" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice"></i> dice</a>
                                   <a href="#" data-icon="fa-dice-d20" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-d20"></i> dice-d20</a>
                                   <a href="#" data-icon="fa-dice-d6" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-d6"></i> dice-d6</a>
                                   <a href="#" data-icon="fa-dice-five" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-five"></i> dice-five</a>
                                   <a href="#" data-icon="fa-dice-four" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-four"></i> dice-four</a>
                                   <a href="#" data-icon="fa-dice-one" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-one"></i> dice-one</a>
                                   <a href="#" data-icon="fa-dice-six" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-six"></i> dice-six</a>
                                   <a href="#" data-icon="fa-dice-three" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-three"></i> dice-three</a>
                                   <a href="#" data-icon="fa-dice-two" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dice-two"></i> dice-two</a>
                                   <a href="#" data-icon="fa-digital-tachograph" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-digital-tachograph"></i> digital-tachograph</a>
                                   <a href="#" data-icon="fa-directions" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-directions"></i> directions</a>
                                   <a href="#" data-icon="fa-disease" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-disease"></i> disease</a>
                                   <a href="#" data-icon="fa-divide" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-divide"></i> divide</a>
                                   <a href="#" data-icon="fa-dizzy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dizzy"></i> dizzy</a><a href="#" data-icon="fa-dna" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dna"></i> dna</a>
                                   <a href="#" data-icon="fa-dog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dog"></i> dog</a>
                                   <a href="#" data-icon="fa-dollar-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dollar-sign"></i> dollar-sign</a>
                                   <a href="#" data-icon="fa-dolly" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dolly"></i> dolly</a>
                                   <a href="#" data-icon="fa-dolly-flatbed" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dolly-flatbed"></i> dolly-flatbed</a>
                                   <a href="#" data-icon="fa-donate" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-donate"></i> donate</a>
                                   <a href="#" data-icon="fa-door-closed" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-door-closed"></i> door-closed</a>
                                   <a href="#" data-icon="fa-door-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-door-open"></i> door-open</a>
                                   <a href="#" data-icon="fa-dot-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dot-circle"></i> dot-circle</a>
                                   <a href="#" data-icon="fa-dove" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dove"></i> dove</a>
                                   <a href="#" data-icon="fa-download" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-download"></i> download</a>
                                   <a href="#" data-icon="fa-drafting-compass" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-drafting-compass"></i> drafting-compass</a>
                                   <a href="#" data-icon="fa-dragon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dragon"></i> dragon</a>
                                   <a href="#" data-icon="fa-draw-polygon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-draw-polygon"></i> draw-polygon</a>
                                   <a href="#" data-icon="fa-drum" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-drum"></i> drum</a>
                                   <a href="#" data-icon="fa-drum-steelpan" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-drum-steelpan"></i> drum-steelpan</a>
                                   <a href="#" data-icon="fa-drumstick-bite" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-drumstick-bite"></i> drumstick-bite</a>
                                   <a href="#" data-icon="fa-dumbbell" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dumbbell"></i> dumbbell</a>
                                   <a href="#" data-icon="fa-dumpster" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dumpster"></i> dumpster</a>
                                   <a href="#" data-icon="fa-dumpster-fire" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dumpster-fire"></i> dumpster-fire</a>
                                   <a href="#" data-icon="fa-dungeon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-dungeon"></i> dungeon</a>
                                   <a href="#" data-icon="fa-edit" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-edit"></i> edit</a><a href="#" data-icon="fa-egg" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-egg"></i> egg</a>
                                   <a href="#" data-icon="fa-eject" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-eject"></i> eject</a>
                                   <a href="#" data-icon="fa-ellipsis-h" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ellipsis-h"></i> ellipsis-h</a>
                                   <a href="#" data-icon="fa-ellipsis-v" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ellipsis-v"></i> ellipsis-v</a>
                                   <a href="#" data-icon="fa-envelope" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-envelope"></i> envelope</a>
                                   <a href="#" data-icon="fa-envelope-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-envelope-open"></i> envelope-open</a>
                                   <a href="#" data-icon="fa-envelope-open-text" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-envelope-open-text"></i> envelope-open-text</a>
                                   <a href="#" data-icon="fa-envelope-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-envelope-square"></i> envelope-square</a>
                                   <a href="#" data-icon="fa-equals" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-equals"></i> equals</a>
                                   <a href="#" data-icon="fa-eraser" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-eraser"></i> eraser</a>
                                   <a href="#" data-icon="fa-ethernet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ethernet"></i> ethernet</a>
                                   <a href="#" data-icon="fa-euro-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-euro-sign"></i> euro-sign</a>
                                   <a href="#" data-icon="fa-exchange-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-exchange-alt"></i> exchange-alt</a>
                                   <a href="#" data-icon="fa-exclamation" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-exclamation"></i> exclamation</a>
                                   <a href="#" data-icon="fa-exclamation-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-exclamation-circle"></i> exclamation-circle</a>
                                   <a href="#" data-icon="fa-exclamation-triangle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-exclamation-triangle"></i> exclamation-triangle</a>
                                   <a href="#" data-icon="fa-expand" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-expand"></i> expand</a>
                                   <a href="#" data-icon="fa-expand-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-expand-alt"></i> expand-alt</a>
                                   <a href="#" data-icon="fa-expand-arrows-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-expand-arrows-alt"></i> expand-arrows-alt</a>
                                   <a href="#" data-icon="fa-external-link-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-external-link-alt"></i> external-link-alt</a>
                                   <a href="#" data-icon="fa-external-link-square-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-external-link-square-alt"></i> external-link-square-alt</a>
                                   <a href="#" data-icon="fa-eye" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-eye"></i> eye</a>
                                   <a href="#" data-icon="fa-eye-dropper" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-eye-dropper"></i> eye-dropper</a>
                                   <a href="#" data-icon="fa-eye-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-eye-slash"></i> eye-slash</a>
                                   <a href="#" data-icon="fa-fan" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fan"></i> fan</a>
                                   <a href="#" data-icon="fa-fat-backward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fat-backward"></i> fat-backward</a>
                                   <a href="#" data-icon="fa-fat-forward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fat-forward"></i> fat-forward</a>
                                   <a href="#" data-icon="fa-faucet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-faucet"></i> faucet</a>
                                   <a href="#" data-icon="fa-fax" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fax"></i> fax</a>
                                   <a href="#" data-icon="fa-feather" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-feather"></i> feather</a>
                                   <a href="#" data-icon="fa-feather-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-feather-alt"></i> feather-alt</a>
                                   <a href="#" data-icon="fa-female" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-female"></i> female</a>
                                   <a href="#" data-icon="fa-fighter-jet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fighter-jet"></i> fighter-jet</a>
                                   <a href="#" data-icon="fa-file" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file"></i> file</a>
                                   <a href="#" data-icon="fa-file-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-alt"></i> file-alt</a>
                                   <a href="#" data-icon="fa-file-archive" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-archive"></i> file-archive</a>
                                   <a href="#" data-icon="fa-file-audio" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-audio"></i> file-audio</a>
                                   <a href="#" data-icon="fa-file-code" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-code"></i> file-code</a>
                                   <a href="#" data-icon="fa-file-contract" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-contract"></i> file-contract</a>
                                   <a href="#" data-icon="fa-file-csv" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-csv"></i> file-csv</a>
                                   <a href="#" data-icon="fa-file-download" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-download"></i> file-download</a>
                                   <a href="#" data-icon="fa-file-excel" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-excel"></i> file-excel</a>
                                   <a href="#" data-icon="fa-file-export" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-export"></i> file-export</a>
                                   <a href="#" data-icon="fa-file-image" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-image"></i> file-image</a>
                                   <a href="#" data-icon="fa-file-import" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-import"></i> file-import</a>
                                   <a href="#" data-icon="fa-file-invoice" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-invoice"></i> file-invoice</a>
                                   <a href="#" data-icon="fa-file-invoice-dollar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-invoice-dollar"></i> file-invoice-dollar</a>
                                   <a href="#" data-icon="fa-file-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-medical"></i> file-medical</a>
                                   <a href="#" data-icon="fa-file-medical-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-medical-alt"></i> file-medical-alt</a>
                                   <a href="#" data-icon="fa-file-pdf" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-pdf"></i> file-pdf</a>
                                   <a href="#" data-icon="fa-file-powerpoint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-powerpoint"></i> file-powerpoint</a>
                                   <a href="#" data-icon="fa-file-prescription" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-prescription"></i> file-prescription</a>
                                   <a href="#" data-icon="fa-file-signature" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-signature"></i> file-signature</a>
                                   <a href="#" data-icon="fa-file-upload" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-upload"></i> file-upload</a>
                                   <a href="#" data-icon="fa-file-video" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-video"></i> file-video</a>
                                   <a href="#" data-icon="fa-file-word" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-file-word"></i> file-word</a>
                                   <a href="#" data-icon="fa-fill" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fill"></i> fill</a>
                                   <a href="#" data-icon="fa-fill-drip" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fill-drip"></i> fill-drip</a>
                                   <a href="#" data-icon="fa-film" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-film"></i> film</a>
                                   <a href="#" data-icon="fa-filter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-filter"></i> filter</a>
                                   <a href="#" data-icon="fa-fingerprint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fingerprint"></i> fingerprint</a>
                                   <a href="#" data-icon="fa-fire" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fire"></i> fire</a>
                                   <a href="#" data-icon="fa-fire-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fire-alt"></i> fire-alt</a>
                                   <a href="#" data-icon="fa-fire-extinguisher" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fire-extinguisher"></i> fire-extinguisher</a>
                                   <a href="#" data-icon="fa-first-aid" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-first-aid"></i> first-aid</a>
                                   <a href="#" data-icon="fa-fish" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fish"></i> fish</a>
                                   <a href="#" data-icon="fa-fist-raised" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-fist-raised"></i> fist-raised</a>
                                   <a href="#" data-icon="fa-flag" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-flag"></i> flag</a>
                                   <a href="#" data-icon="fa-flag-checkered" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-flag-checkered"></i> flag-checkered</a>
                                   <a href="#" data-icon="fa-flag-usa" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-flag-usa"></i> flag-usa</a>
                                   <a href="#" data-icon="fa-flask" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-flask"></i> flask</a>
                                   <a href="#" data-icon="fa-flushed" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-flushed"></i> flushed</a>
                                   <a href="#" data-icon="fa-folder" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-folder"></i> folder</a>
                                   <a href="#" data-icon="fa-folder-minus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-folder-minus"></i> folder-minus</a>
                                   <a href="#" data-icon="fa-folder-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-folder-open"></i> folder-open</a>
                                   <a href="#" data-icon="fa-folder-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-folder-plus"></i> folder-plus</a>
                                   <a href="#" data-icon="fa-font" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-font"></i> font</a>
                                   <a href="#" data-icon="fa-football-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-football-ball"></i> football-ball</a>
                                   <a href="#" data-icon="fa-forward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-forward"></i> forward</a>
                                   <a href="#" data-icon="fa-frog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-frog"></i> frog</a>
                                   <a href="#" data-icon="fa-frown" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-frown"></i> frown</a>
                                   <a href="#" data-icon="fa-frown-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-frown-open"></i> frown-open</a>
                                   <a href="#" data-icon="fa-funnel-dollar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-funnel-dollar"></i> funnel-dollar</a>
                                   <a href="#" data-icon="fa-futbol" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-futbol"></i> futbol</a>
                                   <a href="#" data-icon="fa-gamepad" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gamepad"></i> gamepad</a>
                                   <a href="#" data-icon="fa-gas-pump" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gas-pump"></i> gas-pump</a>
                                   <a href="#" data-icon="fa-gavel" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gavel"></i> gavel</a><a href="#" data-icon="fa-gem" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gem"></i> gem</a>
                                   <a href="#" data-icon="fa-genderless" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-genderless"></i> genderless</a>
                                   <a href="#" data-icon="fa-ghost" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ghost"></i> ghost</a>
                                   <a href="#" data-icon="fa-gift" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gift"></i> gift</a>
                                   <a href="#" data-icon="fa-gifts" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gifts"></i> gifts</a>
                                   <a href="#" data-icon="fa-glass-cheers" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-glass-cheers"></i> glass-cheers</a>
                                   <a href="#" data-icon="fa-glass-martini" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-glass-martini"></i> glass-martini</a>
                                   <a href="#" data-icon="fa-glass-martini-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-glass-martini-alt"></i> glass-martini-alt</a>
                                   <a href="#" data-icon="fa-glass-whiskey" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-glass-whiskey"></i> glass-whiskey</a>
                                   <a href="#" data-icon="fa-glasses" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-glasses"></i> glasses</a>
                                   <a href="#" data-icon="fa-globe" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-globe"></i> globe</a>
                                   <a href="#" data-icon="fa-globe-africa" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-globe-africa"></i> globe-africa</a>
                                   <a href="#" data-icon="fa-globe-americas" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-globe-americas"></i> globe-americas</a>
                                   <a href="#" data-icon="fa-globe-asia" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-globe-asia"></i> globe-asia</a>
                                   <a href="#" data-icon="fa-globe-europe" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-globe-europe"></i> globe-europe</a>
                                   <a href="#" data-icon="fa-golf-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-golf-ball"></i> golf-ball</a>
                                   <a href="#" data-icon="fa-gopuram" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-gopuram"></i> gopuram</a>
                                   <a href="#" data-icon="fa-graduation-cap" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-graduation-cap"></i> graduation-cap</a>
                                   <a href="#" data-icon="fa-greater-than" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-greater-than"></i> greater-than</a>
                                   <a href="#" data-icon="fa-greater-than-equal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-greater-than-equal"></i> greater-than-equal</a>
                                   <a href="#" data-icon="fa-grimace" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grimace"></i> grimace</a>
                                   <a href="#" data-icon="fa-grin" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin"></i> grin</a>
                                   <a href="#" data-icon="fa-grin-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-alt"></i> grin-alt</a>
                                   <a href="#" data-icon="fa-grin-beam" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-beam"></i> grin-beam</a>
                                   <a href="#" data-icon="fa-grin-beam-sweat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-beam-sweat"></i> grin-beam-sweat</a>
                                   <a href="#" data-icon="fa-grin-hearts" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-hearts"></i> grin-hearts</a>
                                   <a href="#" data-icon="fa-grin-squint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-squint"></i> grin-squint</a>
                                   <a href="#" data-icon="fa-grin-squint-tears" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-squint-tears"></i> grin-squint-tears</a>
                                   <a href="#" data-icon="fa-grin-stars" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-stars"></i> grin-stars</a>
                                   <a href="#" data-icon="fa-grin-tears" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-tears"></i> grin-tears</a>
                                   <a href="#" data-icon="fa-grin-tongue" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-tongue"></i> grin-tongue</a>
                                   <a href="#" data-icon="fa-grin-tongue-squint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-tongue-squint"></i> grin-tongue-squint</a>
                                   <a href="#" data-icon="fa-grin-tongue-wink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-tongue-wink"></i> grin-tongue-wink</a>
                                   <a href="#" data-icon="fa-grin-wink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grin-wink"></i> grin-wink</a>
                                   <a href="#" data-icon="fa-grip-horizontal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grip-horizontal"></i> grip-horizontal</a>
                                   <a href="#" data-icon="fa-grip-lines" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grip-lines"></i> grip-lines</a>
                                   <a href="#" data-icon="fa-grip-lines-vertical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grip-lines-vertical"></i> grip-lines-vertical</a>
                                   <a href="#" data-icon="fa-grip-vertical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-grip-vertical"></i> grip-vertical</a>
                                   <a href="#" data-icon="fa-guitar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-guitar"></i> guitar</a>
                                   <a href="#" data-icon="fa-h-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-h-square"></i> h-square</a>
                                   <a href="#" data-icon="fa-hamburger" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hamburger"></i> hamburger</a>
                                   <a href="#" data-icon="fa-hammer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hammer"></i> hammer</a>
                                   <a href="#" data-icon="fa-hamsa" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hamsa"></i> hamsa</a>
                                   <a href="#" data-icon="fa-hand-holding" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-holding"></i> hand-holding</a>
                                   <a href="#" data-icon="fa-hand-holding-heart" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-holding-heart"></i> hand-holding-heart</a>
                                   <a href="#" data-icon="fa-hand-holding-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-holding-medical"></i> hand-holding-medical</a>
                                   <a href="#" data-icon="fa-hand-holding-usd" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-holding-usd"></i> hand-holding-usd</a>
                                   <a href="#" data-icon="fa-hand-holding-water" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-holding-water"></i> hand-holding-water</a>
                                   <a href="#" data-icon="fa-hand-lizard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-lizard"></i> hand-lizard</a>
                                   <a href="#" data-icon="fa-hand-middle-finger" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-middle-finger"></i> hand-middle-finger</a>
                                   <a href="#" data-icon="fa-hand-paper" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-paper"></i> hand-paper</a>
                                   <a href="#" data-icon="fa-hand-peace" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-peace"></i> hand-peace</a>
                                   <a href="#" data-icon="fa-hand-point-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-point-down"></i> hand-point-down</a>
                                   <a href="#" data-icon="fa-hand-point-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-point-left"></i> hand-point-left</a>
                                   <a href="#" data-icon="fa-hand-point-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-point-right"></i> hand-point-right</a>
                                   <a href="#" data-icon="fa-hand-point-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-point-up"></i> hand-point-up</a>
                                   <a href="#" data-icon="fa-hand-pointer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-pointer"></i> hand-pointer</a>
                                   <a href="#" data-icon="fa-hand-rock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-rock"></i> hand-rock</a>
                                   <a href="#" data-icon="fa-hand-scissors" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-scissors"></i> hand-scissors</a>
                                   <a href="#" data-icon="fa-hand-sparkles" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-sparkles"></i> hand-sparkles</a>
                                   <a href="#" data-icon="fa-hand-spock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hand-spock"></i> hand-spock</a>
                                   <a href="#" data-icon="fa-hands" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hands"></i> hands</a>
                                   <a href="#" data-icon="fa-hands-helping" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hands-helping"></i> hands-helping</a>
                                   <a href="#" data-icon="fa-hands-wash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hands-wash"></i> hands-wash</a>
                                   <a href="#" data-icon="fa-handshake" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-handshake"></i> handshake</a>
                                   <a href="#" data-icon="fa-handshake-alt-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-handshake-alt-slash"></i> handshake-alt-slash</a>
                                   <a href="#" data-icon="fa-handshake-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-handshake-slash"></i> handshake-slash</a>
                                   <a href="#" data-icon="fa-hanukiah" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hanukiah"></i> hanukiah</a>
                                   <a href="#" data-icon="fa-hard-hat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hard-hat"></i> hard-hat</a>
                                   <a href="#" data-icon="fa-hashtag" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hashtag"></i> hashtag</a>
                                   <a href="#" data-icon="fa-hat-cowboy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hat-cowboy"></i> hat-cowboy</a>
                                   <a href="#" data-icon="fa-hat-cowboy-side" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hat-cowboy-side"></i> hat-cowboy-side</a>
                                   <a href="#" data-icon="fa-hat-wizard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hat-wizard"></i> hat-wizard</a>
                                   <a href="#" data-icon="fa-hdd" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hdd"></i> hdd</a>
                                   <a href="#" data-icon="fa-head-side-cough" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-head-side-cough"></i> head-side-cough</a>
                                   <a href="#" data-icon="fa-head-side-cough-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-head-side-cough-slash"></i> head-side-cough-slash</a>
                                   <a href="#" data-icon="fa-head-side-mask" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-head-side-mask"></i> head-side-mask</a>
                                   <a href="#" data-icon="fa-head-side-virus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-head-side-virus"></i> head-side-virus</a>
                                   <a href="#" data-icon="fa-heading" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-heading"></i> heading</a>
                                   <a href="#" data-icon="fa-headphones" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-headphones"></i> headphones</a>
                                   <a href="#" data-icon="fa-headphones-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-headphones-alt"></i> headphones-alt</a>
                                   <a href="#" data-icon="fa-headset" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-headset"></i> headset</a>
                                   <a href="#" data-icon="fa-heart" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-heart"></i> heart</a>
                                   <a href="#" data-icon="fa-heart-broken" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-heart-broken"></i> heart-broken</a>
                                   <a href="#" data-icon="fa-heartbeat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-heartbeat"></i> heartbeat</a>
                                   <a href="#" data-icon="fa-helicopter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-helicopter"></i> helicopter</a>
                                   <a href="#" data-icon="fa-highlighter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-highlighter"></i> highlighter</a>
                                   <a href="#" data-icon="fa-hiking" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hiking"></i> hiking</a>
                                   <a href="#" data-icon="fa-hippo" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hippo"></i> hippo</a>
                                   <a href="#" data-icon="fa-history" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-history"></i> history</a>
                                   <a href="#" data-icon="fa-hockey-puck" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hockey-puck"></i> hockey-puck</a>
                                   <a href="#" data-icon="fa-holly-berry" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-holly-berry"></i> holly-berry</a>
                                   <a href="#" data-icon="fa-home" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-home"></i> home</a>
                                   <a href="#" data-icon="fa-horse" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-horse"></i> horse</a>
                                   <a href="#" data-icon="fa-horse-head" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-horse-head"></i> horse-head</a>
                                   <a href="#" data-icon="fa-hospital" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hospital"></i> hospital</a>
                                   <a href="#" data-icon="fa-hospital-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hospital-alt"></i> hospital-alt</a>
                                   <a href="#" data-icon="fa-hospital-symbol" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hospital-symbol"></i> hospital-symbol</a>
                                   <a href="#" data-icon="fa-hospital-user" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hospital-user"></i> hospital-user</a>
                                   <a href="#" data-icon="fa-hot-tub" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hot-tub"></i> hot-tub</a>
                                   <a href="#" data-icon="fa-hotdog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hotdog"></i> hotdog</a>
                                   <a href="#" data-icon="fa-hotel" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hotel"></i> hotel</a>
                                   <a href="#" data-icon="fa-hourglass" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hourglass"></i> hourglass</a>
                                   <a href="#" data-icon="fa-hourglass-end" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hourglass-end"></i> hourglass-end</a>
                                   <a href="#" data-icon="fa-hourglass-half" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hourglass-half"></i> hourglass-half</a>
                                   <a href="#" data-icon="fa-hourglass-start" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hourglass-start"></i> hourglass-start</a>
                                   <a href="#" data-icon="fa-house-damage" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-house-damage"></i> house-damage</a>
                                   <a href="#" data-icon="fa-house-user" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-house-user"></i> house-user</a>
                                   <a href="#" data-icon="fa-hryvnia" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-hryvnia"></i> hryvnia</a>
                                   <a href="#" data-icon="fa-i-cursor" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-i-cursor"></i> i-cursor</a>
                                   <a href="#" data-icon="fa-ice-cream" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ice-cream"></i> ice-cream</a>
                                   <a href="#" data-icon="fa-icicles" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-icicles"></i> icicles</a>
                                   <a href="#" data-icon="fa-icons" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-icons"></i> icons</a>
                                   <a href="#" data-icon="fa-id-badge" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-id-badge"></i> id-badge</a>
                                   <a href="#" data-icon="fa-id-card" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-id-card"></i> id-card</a>
                                   <a href="#" data-icon="fa-id-card-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-id-card-alt"></i> id-card-alt</a>
                                   <a href="#" data-icon="fa-igloo" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-igloo"></i> igloo</a>
                                   <a href="#" data-icon="fa-image" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-image"></i> image</a>
                                   <a href="#" data-icon="fa-images" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-images"></i> images</a>
                                   <a href="#" data-icon="fa-inbox" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-inbox"></i> inbox</a>
                                   <a href="#" data-icon="fa-indent" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-indent"></i> indent</a>
                                   <a href="#" data-icon="fa-industry" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-industry"></i> industry</a>
                                   <a href="#" data-icon="fa-infinity" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-infinity"></i> infinity</a>
                                   <a href="#" data-icon="fa-info" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-info"></i> info</a>
                                   <a href="#" data-icon="fa-info-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-info-circle"></i> info-circle</a>
                                   <a href="#" data-icon="fa-italic" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-italic"></i> italic</a>
                                   <a href="#" data-icon="fa-jedi" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-jedi"></i> jedi</a>
                                   <a href="#" data-icon="fa-joint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-joint"></i> joint</a>
                                   <a href="#" data-icon="fa-journal-whills" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-journal-whills"></i> journal-whills</a>
                                   <a href="#" data-icon="fa-kaaba" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-kaaba"></i> kaaba</a><a href="#" data-icon="fa-key" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-key"></i> key</a>
                                   <a href="#" data-icon="fa-keyboard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-keyboard"></i> keyboard</a>
                                   <a href="#" data-icon="fa-khanda" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-khanda"></i> khanda</a>
                                   <a href="#" data-icon="fa-kiss" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-kiss"></i> kiss</a>
                                   <a href="#" data-icon="fa-kiss-beam" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-kiss-beam"></i> kiss-beam</a>
                                   <a href="#" data-icon="fa-kiss-wink-heart" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-kiss-wink-heart"></i> kiss-wink-heart</a>
                                   <a href="#" data-icon="fa-kiwi-bird" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-kiwi-bird"></i> kiwi-bird</a>
                                   <a href="#" data-icon="fa-landmark" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-landmark"></i> landmark</a>
                                   <a href="#" data-icon="fa-language" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-language"></i> language</a>
                                   <a href="#" data-icon="fa-laptop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laptop"></i> laptop</a>
                                   <a href="#" data-icon="fa-laptop-code" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laptop-code"></i> laptop-code</a>
                                   <a href="#" data-icon="fa-laptop-house" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laptop-house"></i> laptop-house</a>
                                   <a href="#" data-icon="fa-laptop-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laptop-medical"></i> laptop-medical</a>
                                   <a href="#" data-icon="fa-laugh" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laugh"></i> laugh</a>
                                   <a href="#" data-icon="fa-laugh-beam" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laugh-beam"></i> laugh-beam</a>
                                   <a href="#" data-icon="fa-laugh-squint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laugh-squint"></i> laugh-squint</a>
                                   <a href="#" data-icon="fa-laugh-wink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-laugh-wink"></i> laugh-wink</a>
                                   <a href="#" data-icon="fa-layer-group" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-layer-group"></i> layer-group</a>
                                   <a href="#" data-icon="fa-leaf" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-leaf"></i> leaf</a>
                                   <a href="#" data-icon="fa-lemon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lemon"></i> lemon</a>
                                   <a href="#" data-icon="fa-less-than" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-less-than"></i> less-than</a>
                                   <a href="#" data-icon="fa-less-than-equal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-less-than-equal"></i> less-than-equal</a>
                                   <a href="#" data-icon="fa-level-down-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-level-down-alt"></i> level-down-alt</a>
                                   <a href="#" data-icon="fa-level-up-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-level-up-alt"></i> level-up-alt</a>
                                   <a href="#" data-icon="fa-life-ring" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-life-ring"></i> life-ring</a>
                                   <a href="#" data-icon="fa-lightbulb" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lightbulb"></i> lightbulb</a>
                                   <a href="#" data-icon="fa-link" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-link"></i> link</a>
                                   <a href="#" data-icon="fa-lira-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lira-sign"></i> lira-sign</a>
                                   <a href="#" data-icon="fa-list" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-list"></i> list</a>
                                   <a href="#" data-icon="fa-list-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-list-alt"></i> list-alt</a>
                                   <a href="#" data-icon="fa-list-ol" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-list-ol"></i> list-ol</a>
                                   <a href="#" data-icon="fa-list-ul" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-list-ul"></i> list-ul</a>
                                   <a href="#" data-icon="fa-location-arrow" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-location-arrow"></i> location-arrow</a>
                                   <a href="#" data-icon="fa-lock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lock"></i> lock</a>
                                   <a href="#" data-icon="fa-lock-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lock-open"></i> lock-open</a>
                                   <a href="#" data-icon="fa-long-arrow-alt-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-long-arrow-alt-down"></i> long-arrow-alt-down</a>
                                   <a href="#" data-icon="fa-long-arrow-alt-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-long-arrow-alt-left"></i> long-arrow-alt-left</a>
                                   <a href="#" data-icon="fa-long-arrow-alt-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-long-arrow-alt-right"></i> long-arrow-alt-right</a>
                                   <a href="#" data-icon="fa-long-arrow-alt-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-long-arrow-alt-up"></i> long-arrow-alt-up</a>
                                   <a href="#" data-icon="fa-low-vision" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-low-vision"></i> low-vision</a>
                                   <a href="#" data-icon="fa-luggage-cart" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-luggage-cart"></i> luggage-cart</a>
                                   <a href="#" data-icon="fa-lungs" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lungs"></i> lungs</a>
                                   <a href="#" data-icon="fa-lungs-virus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-lungs-virus"></i> lungs-virus</a>
                                   <a href="#" data-icon="fa-magic" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-magic"></i> magic</a>
                                   <a href="#" data-icon="fa-magnet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-magnet"></i> magnet</a>
                                   <a href="#" data-icon="fa-mail-bulk" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mail-bulk"></i> mail-bulk</a>
                                   <a href="#" data-icon="fa-male" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-male"></i> male</a><a href="#" data-icon="fa-map" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map"></i> map</a>
                                   <a href="#" data-icon="fa-map-marked" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-marked"></i> map-marked</a>
                                   <a href="#" data-icon="fa-map-marked-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-marked-alt"></i> map-marked-alt</a>
                                   <a href="#" data-icon="fa-map-marker" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-marker"></i> map-marker</a>
                                   <a href="#" data-icon="fa-map-marker-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-marker-alt"></i> map-marker-alt</a>
                                   <a href="#" data-icon="fa-map-pin" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-pin"></i> map-pin</a>
                                   <a href="#" data-icon="fa-map-signs" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-map-signs"></i> map-signs</a>
                                   <a href="#" data-icon="fa-marker" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-marker"></i> marker</a>
                                   <a href="#" data-icon="fa-mars" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mars"></i> mars</a>
                                   <a href="#" data-icon="fa-mars-double" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mars-double"></i> mars-double</a>
                                   <a href="#" data-icon="fa-mars-stroke" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mars-stroke"></i> mars-stroke</a>
                                   <a href="#" data-icon="fa-mars-stroke-h" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mars-stroke-h"></i> mars-stroke-h</a>
                                   <a href="#" data-icon="fa-mars-stroke-v" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mars-stroke-v"></i> mars-stroke-v</a>
                                   <a href="#" data-icon="fa-mask" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mask"></i> mask</a>
                                   <a href="#" data-icon="fa-medal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-medal"></i> medal</a>
                                   <a href="#" data-icon="fa-medkit" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-medkit"></i> medkit</a>
                                   <a href="#" data-icon="fa-meh" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-meh"></i> meh</a>
                                   <a href="#" data-icon="fa-meh-blank" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-meh-blank"></i> meh-blank</a>
                                   <a href="#" data-icon="fa-meh-rolling-eyes" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-meh-rolling-eyes"></i> meh-rolling-eyes</a>
                                   <a href="#" data-icon="fa-memory" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-memory"></i> memory</a>
                                   <a href="#" data-icon="fa-menorah" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-menorah"></i> menorah</a>
                                   <a href="#" data-icon="fa-mercury" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mercury"></i> mercury</a>
                                   <a href="#" data-icon="fa-meteor" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-meteor"></i> meteor</a>
                                   <a href="#" data-icon="fa-microchip" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microchip"></i> microchip</a>
                                   <a href="#" data-icon="fa-microphone" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microphone"></i> microphone</a>
                                   <a href="#" data-icon="fa-microphone-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microphone-alt"></i> microphone-alt</a>
                                   <a href="#" data-icon="fa-microphone-alt-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microphone-alt-slash"></i> microphone-alt-slash</a>
                                   <a href="#" data-icon="fa-microphone-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microphone-slash"></i> microphone-slash</a>
                                   <a href="#" data-icon="fa-microscope" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-microscope"></i> microscope</a>
                                   <a href="#" data-icon="fa-minus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-minus"></i> minus</a>
                                   <a href="#" data-icon="fa-minus-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-minus-circle"></i> minus-circle</a>
                                   <a href="#" data-icon="fa-minus-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-minus-square"></i> minus-square</a>
                                   <a href="#" data-icon="fa-mitten" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mitten"></i> mitten</a>
                                   <a href="#" data-icon="fa-mobile" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mobile"></i> mobile</a>
                                   <a href="#" data-icon="fa-mobile-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mobile-alt"></i> mobile-alt</a>
                                   <a href="#" data-icon="fa-money-bill" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-bill"></i> money-bill</a>
                                   <a href="#" data-icon="fa-money-bill-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-bill-alt"></i> money-bill-alt</a>
                                   <a href="#" data-icon="fa-money-bill-wave" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-bill-wave"></i> money-bill-wave</a>
                                   <a href="#" data-icon="fa-money-bill-wave-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-bill-wave-alt"></i> money-bill-wave-alt</a>
                                   <a href="#" data-icon="fa-money-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-check"></i> money-check</a>
                                   <a href="#" data-icon="fa-money-check-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-money-check-alt"></i> money-check-alt</a>
                                   <a href="#" data-icon="fa-monument" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-monument"></i> monument</a>
                                   <a href="#" data-icon="fa-moon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-moon"></i> moon</a>
                                   <a href="#" data-icon="fa-mortar-pestle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mortar-pestle"></i> mortar-pestle</a>
                                   <a href="#" data-icon="fa-mosque" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mosque"></i> mosque</a>
                                   <a href="#" data-icon="fa-motorcycle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-motorcycle"></i> motorcycle</a>
                                   <a href="#" data-icon="fa-mountain" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mountain"></i> mountain</a>
                                   <a href="#" data-icon="fa-mouse" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mouse"></i> mouse</a>
                                   <a href="#" data-icon="fa-mouse-pointer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mouse-pointer"></i> mouse-pointer</a>
                                   <a href="#" data-icon="fa-mug-hot" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-mug-hot"></i> mug-hot</a>
                                   <a href="#" data-icon="fa-music" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-music"></i> music</a>
                                   <a href="#" data-icon="fa-network-wired" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-network-wired"></i> network-wired</a>
                                   <a href="#" data-icon="fa-neuter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-neuter"></i> neuter</a>
                                   <a href="#" data-icon="fa-newspaper" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-newspaper"></i> newspaper</a>
                                   <a href="#" data-icon="fa-not-equal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-not-equal"></i> not-equal</a>
                                   <a href="#" data-icon="fa-notes-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-notes-medical"></i> notes-medical</a>
                                   <a href="#" data-icon="fa-object-group" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-object-group"></i> object-group</a>
                                   <a href="#" data-icon="fa-object-ungroup" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-object-ungroup"></i> object-ungroup</a>
                                   <a href="#" data-icon="fa-oil-can" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-oil-can"></i> oil-can</a>
                                   <a href="#" data-icon="fa-om" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-om"></i> om</a><a href="#" data-icon="fa-otter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-otter"></i> otter</a>
                                   <a href="#" data-icon="fa-outdent" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-outdent"></i> outdent</a>
                                   <a href="#" data-icon="fa-pager" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pager"></i> pager</a>
                                   <a href="#" data-icon="fa-paint-brush" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paint-brush"></i> paint-brush</a>
                                   <a href="#" data-icon="fa-paint-roller" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paint-roller"></i> paint-roller</a>
                                   <a href="#" data-icon="fa-palette" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-palette"></i> palette</a>
                                   <a href="#" data-icon="fa-pallet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pallet"></i> pallet</a>
                                   <a href="#" data-icon="fa-paper-plane" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paper-plane"></i> paper-plane</a>
                                   <a href="#" data-icon="fa-paperclip" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paperclip"></i> paperclip</a>
                                   <a href="#" data-icon="fa-parachute-box" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-parachute-box"></i> parachute-box</a>
                                   <a href="#" data-icon="fa-paragraph" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paragraph"></i> paragraph</a>
                                   <a href="#" data-icon="fa-parking" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-parking"></i> parking</a>
                                   <a href="#" data-icon="fa-passport" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-passport"></i> passport</a>
                                   <a href="#" data-icon="fa-pastafarianism" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pastafarianism"></i> pastafarianism</a>
                                   <a href="#" data-icon="fa-paste" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paste"></i> paste</a>
                                   <a href="#" data-icon="fa-pause" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pause"></i> pause</a>
                                   <a href="#" data-icon="fa-pause-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pause-circle"></i> pause-circle</a>
                                   <a href="#" data-icon="fa-paw" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-paw"></i> paw</a><a href="#" data-icon="fa-peace" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-peace"></i> peace</a>
                                   <a href="#" data-icon="fa-pen" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pen"></i> pen</a>
                                   <a href="#" data-icon="fa-pen-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pen-alt"></i> pen-alt</a>
                                   <a href="#" data-icon="fa-pen-fancy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pen-fancy"></i> pen-fancy</a>
                                   <a href="#" data-icon="fa-pen-nib" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pen-nib"></i> pen-nib</a>
                                   <a href="#" data-icon="fa-pen-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pen-square"></i> pen-square</a>
                                   <a href="#" data-icon="fa-pencil-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pencil-alt"></i> pencil-alt</a>
                                   <a href="#" data-icon="fa-pencil-ruler" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pencil-ruler"></i> pencil-ruler</a>
                                   <a href="#" data-icon="fa-people-arrows" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-people-arrows"></i> people-arrows</a>
                                   <a href="#" data-icon="fa-people-carry" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-people-carry"></i> people-carry</a>
                                   <a href="#" data-icon="fa-pepper-hot" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pepper-hot"></i> pepper-hot</a>
                                   <a href="#" data-icon="fa-percent" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-percent"></i> percent</a>
                                   <a href="#" data-icon="fa-percentage" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-percentage"></i> percentage</a>
                                   <a href="#" data-icon="fa-person-booth" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-person-booth"></i> person-booth</a>
                                   <a href="#" data-icon="fa-phone" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone"></i> phone</a>
                                   <a href="#" data-icon="fa-phone-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone-alt"></i> phone-alt</a>
                                   <a href="#" data-icon="fa-phone-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone-slash"></i> phone-slash</a>
                                   <a href="#" data-icon="fa-phone-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone-square"></i> phone-square</a>
                                   <a href="#" data-icon="fa-phone-square-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone-square-alt"></i> phone-square-alt</a>
                                   <a href="#" data-icon="fa-phone-volume" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-phone-volume"></i> phone-volume</a>
                                   <a href="#" data-icon="fa-photo-video" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-photo-video"></i> photo-video</a>
                                   <a href="#" data-icon="fa-piggy-bank" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-piggy-bank"></i> piggy-bank</a>
                                   <a href="#" data-icon="fa-pills" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pills"></i> pills</a>
                                   <a href="#" data-icon="fa-pizza-slice" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pizza-slice"></i> pizza-slice</a>
                                   <a href="#" data-icon="fa-place-of-worship" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-place-of-worship"></i> place-of-worship</a>
                                   <a href="#" data-icon="fa-plane" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plane"></i> plane</a>
                                   <a href="#" data-icon="fa-plane-arrival" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plane-arrival"></i> plane-arrival</a>
                                   <a href="#" data-icon="fa-plane-departure" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plane-departure"></i> plane-departure</a>
                                   <a href="#" data-icon="fa-plane-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plane-slash"></i> plane-slash</a>
                                   <a href="#" data-icon="fa-play" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-play"></i> play</a>
                                   <a href="#" data-icon="fa-play-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-play-circle"></i> play-circle</a>
                                   <a href="#" data-icon="fa-plug" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plug"></i> plug</a><a href="#" data-icon="fa-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plus"></i> plus</a>
                                   <a href="#" data-icon="fa-plus-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plus-circle"></i> plus-circle</a>
                                   <a href="#" data-icon="fa-plus-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-plus-square"></i> plus-square</a>
                                   <a href="#" data-icon="fa-podcast" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-podcast"></i> podcast</a>
                                   <a href="#" data-icon="fa-poll" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-poll"></i> poll</a>
                                   <a href="#" data-icon="fa-poll-h" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-poll-h"></i> poll-h</a>
                                   <a href="#" data-icon="fa-poo" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-poo"></i> poo</a>
                                   <a href="#" data-icon="fa-poo-storm" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-poo-storm"></i> poo-storm</a>
                                   <a href="#" data-icon="fa-poop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-poop"></i> poop</a>
                                   <a href="#" data-icon="fa-portrait" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-portrait"></i> portrait</a>
                                   <a href="#" data-icon="fa-pound-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pound-sign"></i> pound-sign</a>
                                   <a href="#" data-icon="fa-power-off" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-power-off"></i> power-off</a>
                                   <a href="#" data-icon="fa-pray" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pray"></i> pray</a>
                                   <a href="#" data-icon="fa-praying-hands" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-praying-hands"></i> praying-hands</a>
                                   <a href="#" data-icon="fa-prescription" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-prescription"></i> prescription</a>
                                   <a href="#" data-icon="fa-prescription-bottle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-prescription-bottle"></i> prescription-bottle</a>
                                   <a href="#" data-icon="fa-prescription-bottle-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-prescription-bottle-alt"></i> prescription-bottle-alt</a>
                                   <a href="#" data-icon="fa-print" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-print"></i> print</a>
                                   <a href="#" data-icon="fa-procedures" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-procedures"></i> procedures</a>
                                   <a href="#" data-icon="fa-project-diagram" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-project-diagram"></i> project-diagram</a>
                                   <a href="#" data-icon="fa-pump-medical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pump-medical"></i> pump-medical</a>
                                   <a href="#" data-icon="fa-pump-soap" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-pump-soap"></i> pump-soap</a>
                                   <a href="#" data-icon="fa-puzzle-piece" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-puzzle-piece"></i> puzzle-piece</a>
                                   <a href="#" data-icon="fa-qrcode" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-qrcode"></i> qrcode</a>
                                   <a href="#" data-icon="fa-question" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-question"></i> question</a>
                                   <a href="#" data-icon="fa-question-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-question-circle"></i> question-circle</a>
                                   <a href="#" data-icon="fa-quidditch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-quidditch"></i> quidditch</a>
                                   <a href="#" data-icon="fa-quote-left" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-quote-left"></i> quote-left</a>
                                   <a href="#" data-icon="fa-quote-right" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-quote-right"></i> quote-right</a>
                                   <a href="#" data-icon="fa-quran" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-quran"></i> quran</a>
                                   <a href="#" data-icon="fa-radiation" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-radiation"></i> radiation</a>
                                   <a href="#" data-icon="fa-radiation-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-radiation-alt"></i> radiation-alt</a>
                                   <a href="#" data-icon="fa-rainbow" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-rainbow"></i> rainbow</a>
                                   <a href="#" data-icon="fa-random" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-random"></i> random</a>
                                   <a href="#" data-icon="fa-receipt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-receipt"></i> receipt</a>
                                   <a href="#" data-icon="fa-record-vinyl" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-record-vinyl"></i> record-vinyl</a>
                                   <a href="#" data-icon="fa-recycle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-recycle"></i> recycle</a>
                                   <a href="#" data-icon="fa-redo" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-redo"></i> redo</a>
                                   <a href="#" data-icon="fa-redo-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-redo-alt"></i> redo-alt</a>
                                   <a href="#" data-icon="fa-registered" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-registered"></i> registered</a>
                                   <a href="#" data-icon="fa-remove-format" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-remove-format"></i> remove-format</a>
                                   <a href="#" data-icon="fa-reply" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-reply"></i> reply</a>
                                   <a href="#" data-icon="fa-reply-all" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-reply-all"></i> reply-all</a>
                                   <a href="#" data-icon="fa-republican" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-republican"></i> republican</a>
                                   <a href="#" data-icon="fa-restroom" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-restroom"></i> restroom</a>
                                   <a href="#" data-icon="fa-retweet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-retweet"></i> retweet</a>
                                   <a href="#" data-icon="fa-ribbon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ribbon"></i> ribbon</a>
                                   <a href="#" data-icon="fa-ring" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ring"></i> ring</a><a href="#" data-icon="fa-road" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-road"></i> road</a>
                                   <a href="#" data-icon="fa-robot" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-robot"></i> robot</a>
                                   <a href="#" data-icon="fa-rocket" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-rocket"></i> rocket</a>
                                   <a href="#" data-icon="fa-route" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-route"></i> route</a><a href="#" data-icon="fa-rss" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-rss"></i> rss</a>
                                   <a href="#" data-icon="fa-rss-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-rss-square"></i> rss-square</a>
                                   <a href="#" data-icon="fa-ruble-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ruble-sign"></i> ruble-sign</a>
                                   <a href="#" data-icon="fa-ruler" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ruler"></i> ruler</a>
                                   <a href="#" data-icon="fa-ruler-combined" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ruler-combined"></i> ruler-combined</a>
                                   <a href="#" data-icon="fa-ruler-horizontal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ruler-horizontal"></i> ruler-horizontal</a>
                                   <a href="#" data-icon="fa-ruler-vertical" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ruler-vertical"></i> ruler-vertical</a>
                                   <a href="#" data-icon="fa-running" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-running"></i> running</a>
                                   <a href="#" data-icon="fa-rupee-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-rupee-sign"></i> rupee-sign</a>
                                   <a href="#" data-icon="fa-sad-cry" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sad-cry"></i> sad-cry</a>
                                   <a href="#" data-icon="fa-sad-tear" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sad-tear"></i> sad-tear</a>
                                   <a href="#" data-icon="fa-satellite" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-satellite"></i> satellite</a>
                                   <a href="#" data-icon="fa-satellite-dish" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-satellite-dish"></i> satellite-dish</a>
                                   <a href="#" data-icon="fa-save" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-save"></i> save</a>
                                   <a href="#" data-icon="fa-school" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-school"></i> school</a>
                                   <a href="#" data-icon="fa-screwdriver" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-screwdriver"></i> screwdriver</a>
                                   <a href="#" data-icon="fa-scroll" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-scroll"></i> scroll</a>
                                   <a href="#" data-icon="fa-sd-card" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sd-card"></i> sd-card</a>
                                   <a href="#" data-icon="fa-search" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-search"></i> search</a>
                                   <a href="#" data-icon="fa-search-dollar" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-search-dollar"></i> search-dollar</a>
                                   <a href="#" data-icon="fa-search-location" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-search-location"></i> search-location</a>
                                   <a href="#" data-icon="fa-search-minus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-search-minus"></i> search-minus</a>
                                   <a href="#" data-icon="fa-search-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-search-plus"></i> search-plus</a>
                                   <a href="#" data-icon="fa-seedling" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-seedling"></i> seedling</a>
                                   <a href="#" data-icon="fa-server" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-server"></i> server</a>
                                   <a href="#" data-icon="fa-shapes" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shapes"></i> shapes</a>
                                   <a href="#" data-icon="fa-share" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-share"></i> share</a>
                                   <a href="#" data-icon="fa-share-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-share-alt"></i> share-alt</a>
                                   <a href="#" data-icon="fa-share-alt-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-share-alt-square"></i> share-alt-square</a>
                                   <a href="#" data-icon="fa-share-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-share-square"></i> share-square</a>
                                   <a href="#" data-icon="fa-shekel-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shekel-sign"></i> shekel-sign</a>
                                   <a href="#" data-icon="fa-shield-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shield-alt"></i> shield-alt</a>
                                   <a href="#" data-icon="fa-shield-virus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shield-virus"></i> shield-virus</a>
                                   <a href="#" data-icon="fa-ship" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ship"></i> ship</a>
                                   <a href="#" data-icon="fa-shipping-fat" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shipping-fat"></i> shipping-fat</a>
                                   <a href="#" data-icon="fa-shoe-prints" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shoe-prints"></i> shoe-prints</a>
                                   <a href="#" data-icon="fa-shopping-bag" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shopping-bag"></i> shopping-bag</a>
                                   <a href="#" data-icon="fa-shopping-basket" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shopping-basket"></i> shopping-basket</a>
                                   <a href="#" data-icon="fa-shopping-cart" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shopping-cart"></i> shopping-cart</a>
                                   <a href="#" data-icon="fa-shower" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shower"></i> shower</a>
                                   <a href="#" data-icon="fa-shuttle-van" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-shuttle-van"></i> shuttle-van</a>
                                   <a href="#" data-icon="fa-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sign"></i> sign</a>
                                   <a href="#" data-icon="fa-sign-in-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sign-in-alt"></i> sign-in-alt</a>
                                   <a href="#" data-icon="fa-sign-language" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sign-language"></i> sign-language</a>
                                   <a href="#" data-icon="fa-sign-out-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sign-out-alt"></i> sign-out-alt</a>
                                   <a href="#" data-icon="fa-signal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-signal"></i> signal</a>
                                   <a href="#" data-icon="fa-signature" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-signature"></i> signature</a>
                                   <a href="#" data-icon="fa-sim-card" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sim-card"></i> sim-card</a>
                                   <a href="#" data-icon="fa-sink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sink"></i> sink</a>
                                   <a href="#" data-icon="fa-sitemap" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sitemap"></i> sitemap</a>
                                   <a href="#" data-icon="fa-skating" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-skating"></i> skating</a>
                                   <a href="#" data-icon="fa-skiing" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-skiing"></i> skiing</a>
                                   <a href="#" data-icon="fa-skiing-nordic" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-skiing-nordic"></i> skiing-nordic</a>
                                   <a href="#" data-icon="fa-skull" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-skull"></i> skull</a>
                                   <a href="#" data-icon="fa-skull-crossbones" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-skull-crossbones"></i> skull-crossbones</a>
                                   <a href="#" data-icon="fa-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-slash"></i> slash</a>
                                   <a href="#" data-icon="fa-sleigh" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sleigh"></i> sleigh</a>
                                   <a href="#" data-icon="fa-sliders-h" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sliders-h"></i> sliders-h</a>
                                   <a href="#" data-icon="fa-smile" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smile"></i> smile</a>
                                   <a href="#" data-icon="fa-smile-beam" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smile-beam"></i> smile-beam</a>
                                   <a href="#" data-icon="fa-smile-wink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smile-wink"></i> smile-wink</a>
                                   <a href="#" data-icon="fa-smog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smog"></i> smog</a>
                                   <a href="#" data-icon="fa-smoking" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smoking"></i> smoking</a>
                                   <a href="#" data-icon="fa-smoking-ban" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-smoking-ban"></i> smoking-ban</a>
                                   <a href="#" data-icon="fa-sms" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sms"></i> sms</a>
                                   <a href="#" data-icon="fa-snowboarding" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-snowboarding"></i> snowboarding</a>
                                   <a href="#" data-icon="fa-snowflake" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-snowflake"></i> snowflake</a>
                                   <a href="#" data-icon="fa-snowman" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-snowman"></i> snowman</a>
                                   <a href="#" data-icon="fa-snowplow" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-snowplow"></i> snowplow</a>
                                   <a href="#" data-icon="fa-soap" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-soap"></i> soap</a>
                                   <a href="#" data-icon="fa-socks" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-socks"></i> socks</a>
                                   <a href="#" data-icon="fa-solar-panel" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-solar-panel"></i> solar-panel</a>
                                   <a href="#" data-icon="fa-sort" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort"></i> sort</a>
                                   <a href="#" data-icon="fa-sort-alpha-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-alpha-down"></i> sort-alpha-down</a>
                                   <a href="#" data-icon="fa-sort-alpha-down-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-alpha-down-alt"></i> sort-alpha-down-alt</a>
                                   <a href="#" data-icon="fa-sort-alpha-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-alpha-up"></i> sort-alpha-up</a>
                                   <a href="#" data-icon="fa-sort-alpha-up-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-alpha-up-alt"></i> sort-alpha-up-alt</a>
                                   <a href="#" data-icon="fa-sort-amount-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-amount-down"></i> sort-amount-down</a>
                                   <a href="#" data-icon="fa-sort-amount-down-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-amount-down-alt"></i> sort-amount-down-alt</a>
                                   <a href="#" data-icon="fa-sort-amount-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-amount-up"></i> sort-amount-up</a>
                                   <a href="#" data-icon="fa-sort-amount-up-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-amount-up-alt"></i> sort-amount-up-alt</a>
                                   <a href="#" data-icon="fa-sort-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-down"></i> sort-down</a>
                                   <a href="#" data-icon="fa-sort-numeric-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-numeric-down"></i> sort-numeric-down</a>
                                   <a href="#" data-icon="fa-sort-numeric-down-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-numeric-down-alt"></i> sort-numeric-down-alt</a>
                                   <a href="#" data-icon="fa-sort-numeric-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-numeric-up"></i> sort-numeric-up</a>
                                   <a href="#" data-icon="fa-sort-numeric-up-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-numeric-up-alt"></i> sort-numeric-up-alt</a>
                                   <a href="#" data-icon="fa-sort-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sort-up"></i> sort-up</a>
                                   <a href="#" data-icon="fa-spa" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-spa"></i> spa</a>
                                   <a href="#" data-icon="fa-space-shuttle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-space-shuttle"></i> space-shuttle</a>
                                   <a href="#" data-icon="fa-spell-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-spell-check"></i> spell-check</a>
                                   <a href="#" data-icon="fa-spider" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-spider"></i> spider</a>
                                   <a href="#" data-icon="fa-spinner" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-spinner"></i> spinner</a>
                                   <a href="#" data-icon="fa-splotch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-splotch"></i> splotch</a>
                                   <a href="#" data-icon="fa-spray-can" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-spray-can"></i> spray-can</a>
                                   <a href="#" data-icon="fa-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-square"></i> square</a>
                                   <a href="#" data-icon="fa-square-full" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-square-full"></i> square-full</a>
                                   <a href="#" data-icon="fa-square-root-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-square-root-alt"></i> square-root-alt</a>
                                   <a href="#" data-icon="fa-stamp" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stamp"></i> stamp</a>
                                   <a href="#" data-icon="fa-star" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star"></i> star</a>
                                   <a href="#" data-icon="fa-star-and-crescent" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star-and-crescent"></i> star-and-crescent</a>
                                   <a href="#" data-icon="fa-star-half" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star-half"></i> star-half</a>
                                   <a href="#" data-icon="fa-star-half-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star-half-alt"></i> star-half-alt</a>
                                   <a href="#" data-icon="fa-star-of-david" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star-of-david"></i> star-of-david</a>
                                   <a href="#" data-icon="fa-star-of-life" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-star-of-life"></i> star-of-life</a>
                                   <a href="#" data-icon="fa-step-backward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-step-backward"></i> step-backward</a>
                                   <a href="#" data-icon="fa-step-forward" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-step-forward"></i> step-forward</a>
                                   <a href="#" data-icon="fa-stethoscope" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stethoscope"></i> stethoscope</a>
                                   <a href="#" data-icon="fa-sticky-note" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sticky-note"></i> sticky-note</a>
                                   <a href="#" data-icon="fa-stop" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stop"></i> stop</a>
                                   <a href="#" data-icon="fa-stop-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stop-circle"></i> stop-circle</a>
                                   <a href="#" data-icon="fa-stopwatch" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stopwatch"></i> stopwatch</a>
                                   <a href="#" data-icon="fa-stopwatch-20" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stopwatch-20"></i> stopwatch-20</a>
                                   <a href="#" data-icon="fa-store" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-store"></i> store</a>
                                   <a href="#" data-icon="fa-store-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-store-alt"></i> store-alt</a>
                                   <a href="#" data-icon="fa-store-alt-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-store-alt-slash"></i> store-alt-slash</a>
                                   <a href="#" data-icon="fa-store-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-store-slash"></i> store-slash</a>
                                   <a href="#" data-icon="fa-stream" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stream"></i> stream</a>
                                   <a href="#" data-icon="fa-street-view" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-street-view"></i> street-view</a>
                                   <a href="#" data-icon="fa-strikethrough" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-strikethrough"></i> strikethrough</a>
                                   <a href="#" data-icon="fa-stroopwafel" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-stroopwafel"></i> stroopwafel</a>
                                   <a href="#" data-icon="fa-subscript" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-subscript"></i> subscript</a>
                                   <a href="#" data-icon="fa-subway" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-subway"></i> subway</a>
                                   <a href="#" data-icon="fa-suitcase" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-suitcase"></i> suitcase</a>
                                   <a href="#" data-icon="fa-suitcase-rolling" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-suitcase-rolling"></i> suitcase-rolling</a>
                                   <a href="#" data-icon="fa-sun" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sun"></i> sun</a>
                                   <a href="#" data-icon="fa-superscript" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-superscript"></i> superscript</a>
                                   <a href="#" data-icon="fa-surprise" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-surprise"></i> surprise</a>
                                   <a href="#" data-icon="fa-swatchbook" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-swatchbook"></i> swatchbook</a>
                                   <a href="#" data-icon="fa-swimmer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-swimmer"></i> swimmer</a>
                                   <a href="#" data-icon="fa-swimming-pool" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-swimming-pool"></i> swimming-pool</a>
                                   <a href="#" data-icon="fa-synagogue" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-synagogue"></i> synagogue</a>
                                   <a href="#" data-icon="fa-sync" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sync"></i> sync</a>
                                   <a href="#" data-icon="fa-sync-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-sync-alt"></i> sync-alt</a>
                                   <a href="#" data-icon="fa-syringe" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-syringe"></i> syringe</a>
                                   <a href="#" data-icon="fa-table" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-table"></i> table</a>
                                   <a href="#" data-icon="fa-table-tennis" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-table-tennis"></i> table-tennis</a>
                                   <a href="#" data-icon="fa-tablet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tablet"></i> tablet</a>
                                   <a href="#" data-icon="fa-tablet-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tablet-alt"></i> tablet-alt</a>
                                   <a href="#" data-icon="fa-tablets" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tablets"></i> tablets</a>
                                   <a href="#" data-icon="fa-tachometer-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tachometer-alt"></i> tachometer-alt</a>
                                   <a href="#" data-icon="fa-tag" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tag"></i> tag</a><a href="#" data-icon="fa-tags" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tags"></i> tags</a>
                                   <a href="#" data-icon="fa-tape" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tape"></i> tape</a>
                                   <a href="#" data-icon="fa-tasks" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tasks"></i> tasks</a>
                                   <a href="#" data-icon="fa-taxi" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-taxi"></i> taxi</a>
                                   <a href="#" data-icon="fa-teeth" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-teeth"></i> teeth</a>
                                   <a href="#" data-icon="fa-teeth-open" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-teeth-open"></i> teeth-open</a>
                                   <a href="#" data-icon="fa-temperature-high" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-temperature-high"></i> temperature-high</a>
                                   <a href="#" data-icon="fa-temperature-low" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-temperature-low"></i> temperature-low</a>
                                   <a href="#" data-icon="fa-tenge" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tenge"></i> tenge</a>
                                   <a href="#" data-icon="fa-terminal" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-terminal"></i> terminal</a>
                                   <a href="#" data-icon="fa-text-height" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-text-height"></i> text-height</a>
                                   <a href="#" data-icon="fa-text-width" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-text-width"></i> text-width</a>
                                   <a href="#" data-icon="fa-th" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-th"></i> th</a>
                                   <a href="#" data-icon="fa-th-large" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-th-large"></i> th-large</a>
                                   <a href="#" data-icon="fa-th-list" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-th-list"></i> th-list</a>
                                   <a href="#" data-icon="fa-theater-masks" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-theater-masks"></i> theater-masks</a>
                                   <a href="#" data-icon="fa-thermometer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer"></i> thermometer</a>
                                   <a href="#" data-icon="fa-thermometer-empty" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer-empty"></i> thermometer-empty</a>
                                   <a href="#" data-icon="fa-thermometer-full" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer-full"></i> thermometer-full</a>
                                   <a href="#" data-icon="fa-thermometer-half" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer-half"></i> thermometer-half</a>
                                   <a href="#" data-icon="fa-thermometer-quarter" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer-quarter"></i> thermometer-quarter</a>
                                   <a href="#" data-icon="fa-thermometer-three-quarters" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thermometer-three-quarters"></i> thermometer-three-quarters</a>
                                   <a href="#" data-icon="fa-thumbs-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thumbs-down"></i> thumbs-down</a>
                                   <a href="#" data-icon="fa-thumbs-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thumbs-up"></i> thumbs-up</a>
                                   <a href="#" data-icon="fa-thumbtack" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-thumbtack"></i> thumbtack</a>
                                   <a href="#" data-icon="fa-ticket-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-ticket-alt"></i> ticket-alt</a>
                                   <a href="#" data-icon="fa-times" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-times"></i> times</a>
                                   <a href="#" data-icon="fa-times-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-times-circle"></i> times-circle</a>
                                   <a href="#" data-icon="fa-tint" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tint"></i> tint</a>
                                   <a href="#" data-icon="fa-tint-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tint-slash"></i> tint-slash</a>
                                   <a href="#" data-icon="fa-tired" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tired"></i> tired</a>
                                   <a href="#" data-icon="fa-toggle-off" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toggle-off"></i> toggle-off</a>
                                   <a href="#" data-icon="fa-toggle-on" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toggle-on"></i> toggle-on</a>
                                   <a href="#" data-icon="fa-toilet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toilet"></i> toilet</a>
                                   <a href="#" data-icon="fa-toilet-paper" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toilet-paper"></i> toilet-paper</a>
                                   <a href="#" data-icon="fa-toilet-paper-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toilet-paper-slash"></i> toilet-paper-slash</a>
                                   <a href="#" data-icon="fa-toolbox" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-toolbox"></i> toolbox</a>
                                   <a href="#" data-icon="fa-tools" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tools"></i> tools</a>
                                   <a href="#" data-icon="fa-tooth" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tooth"></i> tooth</a>
                                   <a href="#" data-icon="fa-torah" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-torah"></i> torah</a>
                                   <a href="#" data-icon="fa-torii-gate" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-torii-gate"></i> torii-gate</a>
                                   <a href="#" data-icon="fa-tractor" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tractor"></i> tractor</a>
                                   <a href="#" data-icon="fa-trademark" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trademark"></i> trademark</a>
                                   <a href="#" data-icon="fa-traffic-light" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-traffic-light"></i> traffic-light</a>
                                   <a href="#" data-icon="fa-trailer" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trailer"></i> trailer</a>
                                   <a href="#" data-icon="fa-train" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-train"></i> train</a>
                                   <a href="#" data-icon="fa-tram" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tram"></i> tram</a>
                                   <a href="#" data-icon="fa-transgender" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-transgender"></i> transgender</a>
                                   <a href="#" data-icon="fa-transgender-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-transgender-alt"></i> transgender-alt</a>
                                   <a href="#" data-icon="fa-trash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trash"></i> trash</a>
                                   <a href="#" data-icon="fa-trash-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trash-alt"></i> trash-alt</a>
                                   <a href="#" data-icon="fa-trash-restore" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trash-restore"></i> trash-restore</a>
                                   <a href="#" data-icon="fa-trash-restore-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trash-restore-alt"></i> trash-restore-alt</a>
                                   <a href="#" data-icon="fa-tree" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tree"></i> tree</a>
                                   <a href="#" data-icon="fa-trophy" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-trophy"></i> trophy</a>
                                   <a href="#" data-icon="fa-truck" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-truck"></i> truck</a>
                                   <a href="#" data-icon="fa-truck-loading" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-truck-loading"></i> truck-loading</a>
                                   <a href="#" data-icon="fa-truck-monster" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-truck-monster"></i> truck-monster</a>
                                   <a href="#" data-icon="fa-truck-moving" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-truck-moving"></i> truck-moving</a>
                                   <a href="#" data-icon="fa-truck-pickup" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-truck-pickup"></i> truck-pickup</a>
                                   <a href="#" data-icon="fa-tshirt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tshirt"></i> tshirt</a>
                                   <a href="#" data-icon="fa-tty" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tty"></i> tty</a><a href="#" data-icon="fa-tv" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-tv"></i> tv</a>
                                   <a href="#" data-icon="fa-umbrella" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-umbrella"></i> umbrella</a>
                                   <a href="#" data-icon="fa-umbrella-beach" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-umbrella-beach"></i> umbrella-beach</a>
                                   <a href="#" data-icon="fa-underline" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-underline"></i> underline</a>
                                   <a href="#" data-icon="fa-undo" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-undo"></i> undo</a>
                                   <a href="#" data-icon="fa-undo-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-undo-alt"></i> undo-alt</a>
                                   <a href="#" data-icon="fa-universal-access" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-universal-access"></i> universal-access</a>
                                   <a href="#" data-icon="fa-university" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-university"></i> university</a>
                                   <a href="#" data-icon="fa-unlink" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-unlink"></i> unlink</a>
                                   <a href="#" data-icon="fa-unlock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-unlock"></i> unlock</a>
                                   <a href="#" data-icon="fa-unlock-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-unlock-alt"></i> unlock-alt</a>
                                   <a href="#" data-icon="fa-upload" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-upload"></i> upload</a>
                                   <a href="#" data-icon="fa-user" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user"></i> user</a>
                                   <a href="#" data-icon="fa-user-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-alt"></i> user-alt</a>
                                   <a href="#" data-icon="fa-user-alt-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-alt-slash"></i> user-alt-slash</a>
                                   <a href="#" data-icon="fa-user-astronaut" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-astronaut"></i> user-astronaut</a>
                                   <a href="#" data-icon="fa-user-check" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-check"></i> user-check</a>
                                   <a href="#" data-icon="fa-user-circle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-circle"></i> user-circle</a>
                                   <a href="#" data-icon="fa-user-clock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-clock"></i> user-clock</a>
                                   <a href="#" data-icon="fa-user-cog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-cog"></i> user-cog</a>
                                   <a href="#" data-icon="fa-user-edit" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-edit"></i> user-edit</a>
                                   <a href="#" data-icon="fa-user-friends" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-friends"></i> user-friends</a>
                                   <a href="#" data-icon="fa-user-graduate" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-graduate"></i> user-graduate</a>
                                   <a href="#" data-icon="fa-user-injured" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-injured"></i> user-injured</a>
                                   <a href="#" data-icon="fa-user-lock" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-lock"></i> user-lock</a>
                                   <a href="#" data-icon="fa-user-md" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-md"></i> user-md</a>
                                   <a href="#" data-icon="fa-user-minus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-minus"></i> user-minus</a>
                                   <a href="#" data-icon="fa-user-ninja" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-ninja"></i> user-ninja</a>
                                   <a href="#" data-icon="fa-user-nurse" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-nurse"></i> user-nurse</a>
                                   <a href="#" data-icon="fa-user-plus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-plus"></i> user-plus</a>
                                   <a href="#" data-icon="fa-user-secret" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-secret"></i> user-secret</a>
                                   <a href="#" data-icon="fa-user-shield" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-shield"></i> user-shield</a>
                                   <a href="#" data-icon="fa-user-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-slash"></i> user-slash</a>
                                   <a href="#" data-icon="fa-user-tag" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-tag"></i> user-tag</a>
                                   <a href="#" data-icon="fa-user-tie" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-tie"></i> user-tie</a>
                                   <a href="#" data-icon="fa-user-times" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-user-times"></i> user-times</a>
                                   <a href="#" data-icon="fa-users" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-users"></i> users</a>
                                   <a href="#" data-icon="fa-users-cog" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-users-cog"></i> users-cog</a>
                                   <a href="#" data-icon="fa-users-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-users-slash"></i> users-slash</a>
                                   <a href="#" data-icon="fa-utensil-spoon" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-utensil-spoon"></i> utensil-spoon</a>
                                   <a href="#" data-icon="fa-utensils" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-utensils"></i> utensils</a>
                                   <a href="#" data-icon="fa-vector-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vector-square"></i> vector-square</a>
                                   <a href="#" data-icon="fa-venus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-venus"></i> venus</a>
                                   <a href="#" data-icon="fa-venus-double" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-venus-double"></i> venus-double</a>
                                   <a href="#" data-icon="fa-venus-mars" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-venus-mars"></i> venus-mars</a>
                                   <a href="#" data-icon="fa-vest" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vest"></i> vest</a>
                                   <a href="#" data-icon="fa-vest-patches" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vest-patches"></i> vest-patches</a>
                                   <a href="#" data-icon="fa-vial" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vial"></i> vial</a>
                                   <a href="#" data-icon="fa-vials" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vials"></i> vials</a>
                                   <a href="#" data-icon="fa-video" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-video"></i> video</a>
                                   <a href="#" data-icon="fa-video-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-video-slash"></i> video-slash</a>
                                   <a href="#" data-icon="fa-vihara" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vihara"></i> vihara</a>
                                   <a href="#" data-icon="fa-virus" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-virus"></i> virus</a>
                                   <a href="#" data-icon="fa-virus-slash" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-virus-slash"></i> virus-slash</a>
                                   <a href="#" data-icon="fa-viruses" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-viruses"></i> viruses</a>
                                   <a href="#" data-icon="fa-voicemail" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-voicemail"></i> voicemail</a>
                                   <a href="#" data-icon="fa-volleyball-ball" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-volleyball-ball"></i> volleyball-ball</a>
                                   <a href="#" data-icon="fa-volume-down" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-volume-down"></i> volume-down</a>
                                   <a href="#" data-icon="fa-volume-mute" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-volume-mute"></i> volume-mute</a>
                                   <a href="#" data-icon="fa-volume-off" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-volume-off"></i> volume-off</a>
                                   <a href="#" data-icon="fa-volume-up" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-volume-up"></i> volume-up</a>
                                   <a href="#" data-icon="fa-vote-yea" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vote-yea"></i> vote-yea</a>
                                   <a href="#" data-icon="fa-vr-cardboard" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-vr-cardboard"></i> vr-cardboard</a>
                                   <a href="#" data-icon="fa-walking" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-walking"></i> walking</a>
                                   <a href="#" data-icon="fa-wallet" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wallet"></i> wallet</a>
                                   <a href="#" data-icon="fa-warehouse" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-warehouse"></i> warehouse</a>
                                   <a href="#" data-icon="fa-water" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-water"></i> water</a>
                                   <a href="#" data-icon="fa-wave-square" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wave-square"></i> wave-square</a>
                                   <a href="#" data-icon="fa-weight" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-weight"></i> weight</a>
                                   <a href="#" data-icon="fa-weight-hanging" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-weight-hanging"></i> weight-hanging</a>
                                   <a href="#" data-icon="fa-wheelchair" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wheelchair"></i> wheelchair</a>
                                   <a href="#" data-icon="fa-wifi" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wifi"></i> wifi</a><a href="#" data-icon="fa-wind" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wind"></i> wind</a>
                                   <a href="#" data-icon="fa-window-close" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-window-close"></i> window-close</a>
                                   <a href="#" data-icon="fa-window-maximize" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-window-maximize"></i> window-maximize</a>
                                   <a href="#" data-icon="fa-window-minimize" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-window-minimize"></i> window-minimize</a>
                                   <a href="#" data-icon="fa-window-restore" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-window-restore"></i> window-restore</a>
                                   <a href="#" data-icon="fa-wine-bottle" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wine-bottle"></i> wine-bottle</a>
                                   <a href="#" data-icon="fa-wine-glass" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wine-glass"></i> wine-glass</a>
                                   <a href="#" data-icon="fa-wine-glass-alt" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wine-glass-alt"></i> wine-glass-alt</a>
                                   <a href="#" data-icon="fa-won-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-won-sign"></i> won-sign</a>
                                   <a href="#" data-icon="fa-wrench" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-wrench"></i> wrench</a>
                                   <a href="#" data-icon="fa-x-ray" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-x-ray"></i> x-ray</a>
                                   <a href="#" data-icon="fa-yen-sign" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-yen-sign"></i> yen-sign</a>
                                   <a href="#" data-icon="fa-yin-yang" class="fa-hover col-md-3 col-sm-4"> <i class="fa fa-yin-yang"></i> yin-yang</a>
                               </div>
                           </section>
                       </div>
                   </div>
                   <div class="clear"></div>
               </div>
           </div>
       </div>
   </div>
   </>
)}

}

export default IconsPopup;