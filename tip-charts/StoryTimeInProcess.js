<!DOCTYPE HTML>

<html>
    <head>
        <script type="text/javascript"">
            var userConfig = {
                subTitle: 'Stories In-Progress to Accepted',
                debug: false,
                trace: false,
                daysToShow: 60,
                // asOf: "2012-10-15",  // Optional. Only supply if want a specific time frame. Do not send in new Date().toISOString().
                statePredicate: {ScheduleState:{$lt:"Accepted", $gte:"In-Progress"}},
                type: 'HierarchicalRequirement',
                leafOnly: true,
                showTheseFieldsInToolTip: [ // Will automatically show ObjectID and Work Days In State
                  'Name',
                  {field: 'PlanEstimate', as: "Plan Estimate"}
                ],
                radiusField: {field: 'PlanEstimate', f: function(value){
                  if (isNaN(value)) {
                    return 5
                  } else {
                    return Math.pow(value, 0.6) + 5
                  }
                }},
                workDayStartOn: {hour: 9},
                workDayEndBefore: {hour: 17},
                // deriveFieldsOnSnapshotsConfig:
                // holidays: (unless we pull them from some data model in Rally)
                // workDays: (if you want to override the default pulling from WorkspaceConfiguration)
            }

/*
            // Feature Aging
            userConfig.subTitle = 'Features In Dev and less than 100% done'
            userConfig.daysToShow = 365
            userConfig.statePredicate = {"State":"In Dev", "PercentDoneByStoryCount":{$lt:1,$gt:0}}
            userConfig.type = 'PortfolioItem/Feature'
            userConfig.leafOnly = false
            userConfig.showTheseFieldsInToolTip = [
              'Name',
              {field: 'LeafStoryCount', as: 'Leaf Story Count'},
              {field: "PercentDoneByStoryCount", as: 'Percent Done By Story Count', f: function(value) {
                return Math.floor(value * 100 + 0.5).toString() + '%';
              }}
            ]
            userConfig.radiusField = {field: 'LeafStoryCount', f: function(value){
              return Math.pow(value, 0.6) + 5
            }}
*/


        </script>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Time In Process (TIP) Chart</title>

        <!-- HighCharts -->
        <script type="text/javascript" src="https://people.rallydev.com/js/jquery.min.js"></script>
        <script type="text/javascript" src="https://people.rallydev.com/js/highcharts.js"></script>
        <script type="text/javascript" src="https://people.rallydev.com/js/exporting.js"></script>
        <!-- a theme file
            <script type="text/javascript" src="../js/themes/gray.js"></script>
        -->
        <!-- Lumenize -->
        <script type="text/javascript" src="https://storage.googleapis.com/versions.lumenize.com/v0.5.5/Lumenize-min.js"></script>

        <!-- rally_analytics -->

<script type="text/javascript">
(function(){var t,e,s,i,r,n,o,a,l,h,u,p=function(t,e){return function(){return t.apply(e,arguments)}},c={}.hasOwnProperty,d=function(t,e){function s(){this.constructor=t}for(var i in e)c.call(e,i)&&(t[i]=e[i]);return s.prototype=e.prototype,t.prototype=new s,t.__super__=e.prototype,t},f=[].indexOf||function(t){for(var e=0,s=this.length;s>e;e++)if(e in this&&this[e]===t)return e;return-1};l="undefined"!=typeof exports&&null!==exports?require("../lib/Lumenize"):require("/lumenize"),u=l.utils,n=l.Time,h=this,t=function(){function t(t,e){var s,i,r,n,o,a,l,u,c,d;this.upToDate=e,this._gotResponse=p(this._gotResponse,this),this._debug=!1,"undefined"==typeof process||null===process||"undefined"!=typeof window&&null!==window?null!=h.XMLHttpRequest&&(s=h.XMLHttpRequest):s=require("xmlhttprequest").XMLHttpRequest,this.XHRClass=s,this._xhr=null,this._find=null,this._fields=[],this._sort={_ValidFrom:1},this._startIndex=0,this._pageSize=1e5,this._callback=null,this.headers={},this.headers["X-RallyIntegrationLibrary"]="rally_analytics-0.1.0","undefined"!=typeof navigator&&null!==navigator?(o=navigator.appName+" "+navigator.appVersion,n=navigator.platform):"undefined"!=typeof process&&null!==process&&(o="Node.js (or some other non-browser) "+process.version,n=process.platform),this.headers["X-RallyIntegrationPlatform"]=o,this.headers["X-RallyIntegrationOS"]=n,l=t.additionalHeaders;for(r in l)a=l[r],this.headers[r]=a;if(i=function(e,s){if(null!=t[s])return e[s]=t[s];throw Error("Must include config["+s+"] header when instantiating this rally_analytics.AnalyticsQuery object")},i(this.headers,"X-RallyIntegrationName"),i(this.headers,"X-RallyIntegrationVendor"),i(this.headers,"X-RallyIntegrationVersion"),null!=t.workspaceOID)this.workspaceOID=t.workspaceOID;else{if(!("undefined"!=typeof process&&null!==process?null!=(u=process.env)?u.RALLY_WORKSPACE:void 0:void 0))throw Error("Must provide a config.workspaceOID or set environment variable RALLY_WORKSPACE");this.workspaceOID=process.env.RALLY_WORKSPACE}this.username=null!=t.username?t.username:("undefined"!=typeof process&&null!==process?null!=(c=process.env)?c.RALLY_USER:void 0:void 0)?process.env.RALLY_USER:void 0,this.password=null!=t.password?t.password:("undefined"!=typeof process&&null!==process?null!=(d=process.env)?d.RALLY_PASSWORD:void 0:void 0)?process.env.RALLY_PASSWORD:void 0,this.protocol="https",this.server="rally1.rallydev.com",this.service="analytics",this.version="v2.0",this.endpoint="artifact/snapshot/query.js",this._hasMorePages=!0,this._firstPage=!0,this.ETLDate=null,this.lastResponseText="",this.lastResponse={},this.lastPageResults=[],this.allResults=[],this.lastPageMeta={},this.allMeta=[]}return t.prototype.resetFind=function(){return this._find=null},t.prototype.find=function(t){return this._find=t,this},t.prototype.sort=function(){throw Error("Sort must be {_ValidFrom: 1}.")},t.prototype._setSort=function(t){return this._sort=t,this},t.prototype.fields=function(t){return this._fields=this._fields.concat(t),this},t.prototype.hydrate=function(t){return this._hydrate=t,this},t.prototype.start=function(t){return this._startIndex=t,this},t.prototype.startIndex=function(t){return this._startIndex=t,this},t.prototype.pagesize=function(t){return this._pageSize=t,this},t.prototype.pageSize=function(t){return this._pageSize=t,this},t.prototype.auth=function(t,e){return this.username=t,this.password=e,this},t.prototype.debug=function(){return this._debug=!0},t.prototype.getBaseURL=function(){return this.protocol+"://"+[this.server,this.service,this.version,"service/rally/workspace",this.workspaceOID,this.endpoint].join("/")},t.prototype.getQueryString=function(){var t,e;if(t=JSON.stringify(this._find),null!=this._find&&t.length>2)return e=[],e.push("find="+t),null!=this._sort&&e.push("sort="+JSON.stringify(this._sort)),null!=this._fields&&(this._fields[0]===!0?e.push("fields=true"):this._fields.length>0&&e.push("fields="+JSON.stringify(this._fields))),null!=this._hydrate&&e.push("hydrate="+JSON.stringify(this._hydrate)),e.push("start="+this._startIndex),e.push("pagesize="+this._pageSize),e.join("&");throw Error("find clause not set")},t.prototype.getURL=function(){var t;return t=this.getBaseURL()+"?"+this.getQueryString(),this._debug&&(console.log("\nfind: ",this._find),console.log("\nurl:"),console.log(t)),encodeURI(t)},t.prototype.getAll=function(){throw Error("getAll() not supported in this version of AnalyticsQuery.")},t.prototype.hasMorePages=function(){return this._hasMorePages},t.prototype.getPage=function(t){var e,s,i;if(this._callback=t,null==this._find)throw Error("Must set find clause before calling getPage");if(null==this.XHRClass)throw Error("Must set XHRClass");if(!this._hasMorePages)throw Error("All pages retrieved. Inspect AnalyticsQuery.allResults and AnalyticsQuery.allMeta for results.");if(null==this.upToDate)throw Error("Must set property upToDate before calling getPage");this._xhr=new this.XHRClass,this._xhr.onreadystatechange=this._gotResponse,this._xhr.open("GET",this.getURL(),!0,this.username,this.password),i=this.headers;for(e in i)s=i[e],this._xhr.setRequestHeader(e,s);return this._xhr.send(),this},t.prototype._gotResponse=function(){var t,e,s,i,r,n,o,a,l;if(this._debug&&console.log("\nreadyState: ",this._xhr.readyState),4===this._xhr.readyState){if(this.lastResponseText=this._xhr.responseText,this.lastResponse=JSON.parse(this.lastResponseText),this._debug&&(console.log("\nresponse headers:\n"),console.log(this._xhr.getAllResponseHeaders()),console.log("\nstatus: ",this._xhr.status),"string"==typeof this.lastResponse?console.log("\nlastResponseText: ",this.lastResponseText):console.log("\nlastResponseJSON: ",this.lastResponse)),this.lastResponse.Errors.length>0)return console.log("Errors\n"+JSON.stringify(this.lastResponse.Errors)),_return();if(this._firstPage)this._firstPage=!1,this.allResults=[],this.allMeta=[],this.ETLDate=this.lastResponse.ETLDate,this._pageSize=this.lastResponse.PageSize,e={$and:[this._find,{_ValidFrom:{$lte:this.ETLDate}}]},this._find=e;else if(this.lastResponse.PageSize!==this._pageSize)throw Error("Pagesize changed after first page which is unexpected.");for(r=this.upToDate,this.lastResponse.Results.length+this.lastResponse.StartIndex>=this.lastResponse.TotalResultCount?(this._hasMorePages=!1,this.upToDate=this.ETLDate):(this._hasMorePages=!0,this.upToDate=this.lastResponse.Results[this.lastResponse.Results.length-1]._ValidFrom),this.lastPageResults=[],i=this.lastResponse.Results,o=0,a=i.length;a>o;o++)s=i[o],s._ValidFrom!==this.upToDate&&this.lastPageResults.push(s);this._startIndex+=this.lastPageResults.length,this.allResults=this.allResults.concat(this.lastPageResults),this.lastPageMeta={},l=this.lastResponse;for(t in l)n=l[t],"Results"!==t&&(this.lastPageMeta[t]=n);return this.allMeta.push(this.lastPageMeta),this._callback(this.lastPageResults,r,this.upToDate,this)}},t}(),r=function(t){function e(t,s){e.__super__.constructor.call(this,t,s),this._scope={},this._type=null,this._additionalCriteria=[]}return d(e,t),e.prototype.generateFind=function(){var t,e,s,i,r,n;if(e=[],!(JSON.stringify(this._scope).length>2))throw Error("Must set scope first.");for(e.push(this._scope),null!=this._type&&e.push(this._type),r=this._additionalCriteria,s=0,i=r.length;i>s;s++)t=r[s],e.push(t);return(n=e.length)>0&&2>n?e[0]:{$and:e}},e.prototype.find=function(){if(arguments.length>0)throw Error("Do not call find() directly to set query. Use scope(), type(), and additionalCriteria()");return e.__super__.find.call(this,this.generateFind()),this},e.prototype.resetScope=function(){return this._scope={}},e.prototype.scope=function(t,e){var s,i,r,n=this;if(s=function(t,e){var s;if("ItemHierarchy"===t&&(t="_ItemHierarchy"),"Tag"===t&&(t="Tags"),"ProjectHierarchy"===t&&(t="_ProjectHierarchy"),s=["Project","_ProjectHierarchy","Iteration","Release","Tags","_ItemHierarchy"],0>f.call(s,t))throw Error("Key for scope() call must be one of "+s);return n._scope[t]="array"===u.type(e)?{$in:e}:e},"object"===u.type(t))for(i in t)r=t[i],s(i,r);else{if(2!==arguments.length)throw Error("Must provide an Object in first parameter or two parameters (key, value).");s(t,e)}return this},e.prototype.resetType=function(){return this._type=null},e.prototype.type=function(t){return this._type={_TypeHierarchy:t},this},e.prototype.resetAdditionalCriteria=function(){return this._additionalCriteria=[]},e.prototype.additionalCriteria=function(t){return this._additionalCriteria.push(t),this},e.prototype.leafOnly=function(){return this.additionalCriteria({$or:[{_TypeHierarchy:-51038,Children:null},{_TypeHierarchy:-51078,Children:null,UserStories:null},{_TypeHierarchy:{$nin:[-51038,-51078]}}]}),this},e.prototype.getPage=function(t){return this.find(),e.__super__.getPage.call(this,t)},e}(t),e=function(t){function e(t,s,i){if(e.__super__.constructor.call(this,t,s),null==i)throw Error("Must provide a zuluDateString when instantiating an AtAnalyticsQuery.");this._additionalCriteria.push({_At:i})}return d(e,t),e}(r),s=function(t){function e(t,s){throw e.__super__.constructor.call(this,t,s),Error("AtArrayAnalyticsQuery is not yet implemented")}return d(e,t),e}(r),i=function(t){function e(t,s,i){var r;if(e.__super__.constructor.call(this,t,s),null==s||null==i)throw Error("Must provide two zulu data strings when instantiating a BetweenAnalyticsQuery.");r={_ValidFrom:{$lt:i},_ValidTo:{$gt:s}},this._additionalCriteria.push(r)}return d(e,t),e}(r),o=function(t){function e(t,s,i){if(e.__super__.constructor.call(this,t,s),null==i)throw Error("Must provide a predicate when instantiating a TimeInStateAnalyticsQuery.");this._additionalCriteria.push(i),this._additionalCriteria.push({_ValidTo:{$gt:s}}),this.fields(["ObjectID","_ValidFrom","_ValidTo"])}return d(e,t),e}(r),a=function(t){function e(t,s,i){if(e.__super__.constructor.call(this,t,s),null==i)throw Error("Must provide a predicate when instantiating a TimeInStateAnalyticsQuery.");this._additionalCriteria.push(i),this._additionalCriteria.push({_ValidFrom:{$gte:s}}),this.fields(["ObjectID","_ValidFrom","_ValidTo"])}return d(e,t),e}(r),h.AnalyticsQuery=t,h.GuidedAnalyticsQuery=r,h.AtAnalyticsQuery=e,h.AtArrayAnalyticsQuery=s,h.BetweenAnalyticsQuery=i,h.TimeInStateAnalyticsQuery=o,h.TransitionsAnalyticsQuery=a}).call(this);
</script>

        <!-- md5 -->

<script type="text/javascript">
(function(){function t(t,r,e){return t&r|~t&e}function r(t,r,e){return t&e|r&~e}function e(t,r,e){return t^r^e}function s(t,r,e){return r^(t|~e)}function i(t){return String.fromCharCode(255&t)+String.fromCharCode(255&t>>>8)+String.fromCharCode(255&t>>>16)+String.fromCharCode(255&t>>>24)}function n(t){for(;0>t;)t+=4294967296;for(;t>4294967295;)t-=4294967296;return t}function a(t,r,e,s,i){var a,o,l,u,p,y,c,d,f;a=s[0],o=s[1],l=s[2],u=s[3],p=i[0],y=i[1],c=i[2],f=e(r[o],r[l],r[u]),d=r[a]+f+t[p]+h[c],d=n(d),d=d<<y|d>>>32-y,d+=r[o],r[a]=n(d)}function o(t){var r,e,s,o,l,h,u,p,y,c,f,_,g;if(s=Array(1732584193,4023233417,2562383102,271733878),l=t.length,h=63&l,u=56>h?56-h:120-h,u>0)for(t+="",c=0;u-1>c;c++)t+="\0";for(t+=i(8*l),t+=i(0),l+=u+8,r=Array(0,1,2,3),e=Array(16),o=Array(4),_=0;l>_;_+=64){for(c=0,f=_;16>c;c++,f+=4)e[c]=t.charCodeAt(f)|t.charCodeAt(f+1)<<8|t.charCodeAt(f+2)<<16|t.charCodeAt(f+3)<<24;for(c=0;4>c;c++)o[c]=s[c];for(c=0;4>c;c++)for(p=d[c][0],y=d[c][1],f=0;16>f;f++)a(e,o,p,r,y[f]),g=r[0],r[0]=r[3],r[3]=r[2],r[2]=r[1],r[1]=g;for(c=0;4>c;c++)s[c]+=o[c],s[c]=n(s[c])}return i(s[0])+i(s[1])+i(s[2])+i(s[3])}function l(t){var r,e,s,i;for(i=o(t),e="",r=0;16>r;r++)s=i.charCodeAt(r),e+="0123456789abcdef".charAt(15&s>>4),e+="0123456789abcdef".charAt(15&s);return e}var h=Array(0,3614090360,3905402710,606105819,3250441966,4118548399,1200080426,2821735955,4249261313,1770035416,2336552879,4294925233,2304563134,1804603682,4254626195,2792965006,1236535329,4129170786,3225465664,643717713,3921069994,3593408605,38016083,3634488961,3889429448,568446438,3275163606,4107603335,1163531501,2850285829,4243563512,1735328473,2368359562,4294588738,2272392833,1839030562,4259657740,2763975236,1272893353,4139469664,3200236656,681279174,3936430074,3572445317,76029189,3654602809,3873151461,530742520,3299628645,4096336452,1126891415,2878612391,4237533241,1700485571,2399980690,4293915773,2240044497,1873313359,4264355552,2734768916,1309151649,4149444226,3174756917,718787259,3951481745),u=Array(Array(0,7,1),Array(1,12,2),Array(2,17,3),Array(3,22,4),Array(4,7,5),Array(5,12,6),Array(6,17,7),Array(7,22,8),Array(8,7,9),Array(9,12,10),Array(10,17,11),Array(11,22,12),Array(12,7,13),Array(13,12,14),Array(14,17,15),Array(15,22,16)),p=Array(Array(1,5,17),Array(6,9,18),Array(11,14,19),Array(0,20,20),Array(5,5,21),Array(10,9,22),Array(15,14,23),Array(4,20,24),Array(9,5,25),Array(14,9,26),Array(3,14,27),Array(8,20,28),Array(13,5,29),Array(2,9,30),Array(7,14,31),Array(12,20,32)),y=Array(Array(5,4,33),Array(8,11,34),Array(11,16,35),Array(14,23,36),Array(1,4,37),Array(4,11,38),Array(7,16,39),Array(10,23,40),Array(13,4,41),Array(0,11,42),Array(3,16,43),Array(6,23,44),Array(9,4,45),Array(12,11,46),Array(15,16,47),Array(2,23,48)),c=Array(Array(0,6,49),Array(7,10,50),Array(14,15,51),Array(5,21,52),Array(12,6,53),Array(3,10,54),Array(10,15,55),Array(1,21,56),Array(8,6,57),Array(15,10,58),Array(6,15,59),Array(13,21,60),Array(4,6,61),Array(11,10,62),Array(2,15,63),Array(9,21,64)),d=Array(Array(t,u),Array(r,p),Array(e,y),Array(s,c));this.md5=l}).call(this);
</script>

        <!-- my visualizer for this chart (optional) -->

<script type="text/javascript">
(function(){var t,e,r,s,i;r=function(t){return unescape(encodeURIComponent(t))},e=function(t){return decodeURIComponent(escape(t))},i=function(t){var e,s,i,o,a,n,l;for(t=r(t),o={},i=(t+"").split(""),n=[],s=void 0,l=i[0],e=256,a=1;i.length>a;)s=i[a],null!=o[l+s]?l+=s:(n.push(l.length>1?o[l]:l.charCodeAt(0)),o[l+s]=e,e++,l=s),a++;for(n.push(l.length>1?o[l]:l.charCodeAt(0)),a=0;n.length>a;)n[a]=String.fromCharCode(n[a]),a++;return n.join("")},s=function(t){var r,s,i,o,a,n,l,h,u,c;for(a={},o=(t+"").split(""),s=o[0],l=s,h=[s],r=256,c=void 0,n=1;o.length>n;)i=o[n].charCodeAt(0),c=256>i?o[n]:a[i]?a[i]:l+s,h.push(c),s=c.charAt(0),a[r]=l+s,r++,l=c,n++;return u=h.join(""),e(u)},t=function(){function t(e,r,s,i){var o;if(this.directoryForNodeJSCache=null!=e?e:"./local-storage-cache",this.quotaForNodeJSCache=null!=r?r:5242880,this.keyForMetaData=null!=s?s:"local-storage-cache-key-for-meta-data",null!=i)null!=i.setItem&&null!=i.getItem&&null!=i.removeItem?(t.localStorage=i,null!=i.location&&(this.directoryForNodeJSCache=i.location),null!=i.quota&&(this.quotaForNodeJSCache=i.quota)):t.localStorage=null;else if("undefined"!=typeof localStorage&&null!==localStorage)t.localStorage=localStorage;else try{o=require("node-localstorage").LocalStorage,t.localStorage=new o(this.directoryForNodeJSCache,this.quotaForNodeJSCache)}catch(a){t.localStorage=null}null==t.meta&&(t.meta=this.getItem(this.keyForMetaData),null==t.meta&&(t.meta={}))}return t.meta=null,t.localStorage=null,t.prototype.setItem=function(e,r){var s,o;if(null!=t.localStorage){if(o=i(JSON.stringify(r)),o.length>2097152)return;for(;;)try{t.localStorage.setItem(e,o);break}catch(a){this._removeOldestItem()}s={},s.lastUpdated=(new Date).getTime(),t.meta[e]=s,this._updateMeta()}return this},t.prototype.getItem=function(e){var r,i;if(null==t.localStorage)return void 0;if(i=t.localStorage.getItem(e),null==i)return void 0;try{return r=JSON.parse(s(i))}catch(o){return this.removeItem(e),void 0}},t.prototype.removeItem=function(e){return null!=t.localStorage&&(t.localStorage.removeItem(e),delete t.meta[e],this._updateMeta()),this},t.prototype._removeOldestItem=function(){var e,r,s,i,o,a;o=(new Date).getTime(),i=null,e=0,a=t.meta;for(r in a)s=a[r],e++,o>s.lastUpdated&&(i=r,o=s.lastUpdated);return 0===e&&(t.localStorage.clear(),this.clear()),this.removeItem(i)},t.prototype._updateMeta=function(){var e;for(e=[];;)try{t.localStorage.setItem(this.keyForMetaData,JSON.stringify(t.meta));break}catch(r){e.push(this._removeOldestItem())}return e},t.prototype.clear=function(){var e,r,s;if(null!=t.localStorage){s=t.meta;for(e in s)r=s[e],t.localStorage.removeItem(e);t.meta={},this._updateMeta()}return this},t}(),"undefined"!=typeof exports&&this.exports!==exports?(exports.LocalCache=t,exports.lzwDecode=s,exports.lzwEncode=i):(this.LocalCache=t,this.lzwDecode=s,this.lzwEncode=i)}).call(this);
</script>

<script type="text/javascript">
(function(){var t,e,r,i,s=function(t,e){return function(){return t.apply(e,arguments)}},o=[].slice;r="undefined"!=typeof exports&&null!==exports?require("../lib/Lumenize"):require("/lumenize"),i=r.utils,t=r.Time,e=function(){function e(t,e,r){this.visualizations=t,this.userConfig=e,this.createVisualizationCB=r,this.onSnapshotsReceieved=s(this.onSnapshotsReceieved,this),this.config=i.clone(this.userConfig),this.config.trace&&console.log("in VisualizerBase.constructor"),this.cache=new LocalCache,null==this.config.debug&&(this.config.debug=!1),this.getProjectAndWorkspaceScope()}return e.prototype.getProjectAndWorkspaceScope=function(){var t,e,r,i,s,o,a,n=this;return this.config.trace&&console.log("in VisualizerBase.getProjectAndWorkspaceScope"),top===self?(o=41529001,i=!1,r=!0,t=81147451,e=[t]):(o=41529001,i=false,r=true,t=279050021,e=[279050021]),s={workspaceOID:o,projectScopingUp:i,projectScopingDown:r,projectOID:t,projectOIDsInScope:e},a=function(t){return n.projectAndWorkspaceScope=t,n.getWorkspaceConfiguration()},a(s)},e.prototype.getWorkspaceConfiguration=function(){var t,e,r=this;return this.config.trace&&console.log("in VisualizerBase.getWorkspaceConfiguration"),t={DateFormat:"MM/dd/yyyy",DateTimeFormat:"MM/dd/yyyy hh:mm:ss a",IterationEstimateUnitName:"Points",ReleaseEstimateUnitName:"Points",TaskUnitName:"Hours",TimeTrackerEnabled:!0,TimeZone:"America/Denver",WorkDays:"Monday,Tuesday,Wednesday,Thursday,Friday"},e=function(t){return r.workspaceConfiguration=t,r.initialize(),r.onConfigOrScopeUpdated()},e(t)},e.prototype.onConfigOrScopeUpdated=function(){var t;return this.config.trace&&console.log("in VisualizerBase.onConfigOrScopeUpdated"),t=this.cache.getItem(this.getHashForCache()),null!=t?(this.config.debug&&(console.log("Found a saved state in cache. Restoring from savedState. Size:",JSON.stringify(t).length),console.log(t)),this.lumenizeCalculator=this.LumenizeCalculatorClass.newFromSavedState(t),this.upToDateISOString=this.lumenizeCalculator.upToDateISOString):(this.config.debug&&console.log("Did not find a saved state in cache. Calculating from scratch."),this.lumenizeCalculator=new this.LumenizeCalculatorClass(this.config.lumenizeCalculatorConfig),this.upToDateISOString=null),this.fetchPending=!0,this.createVisualization(),this.dirty=!1,this.onNewDataAvailable()},e.prototype.getAsOfISOString=function(){return this.asOfISOString=null!=this.config.asOf?new t(this.config.asOf,"millisecond").getISOStringInTZ(this.config.lumenizeCalculatorConfig.tz):t.getISOStringFromJSDate()},e.prototype.onSnapshotsReceieved=function(e,r,i,s){var o;return null==s&&(s=null),this.config.trace&&console.log("in VisualizerBase.onSnapshotsReceieved"),this.dirty=e.length>0&&new t(i).getJSDate("GMT").getTime()-new t(r).getJSDate("GMT").getTime()>3e5?!0:!1,this.upToDateISOString=i,this.deriveFieldsOnSnapshots(e),o=this.getAsOfISOString(),i>o&&(i=o),this.updateCalculator(e,r,i),this.fetchPending=null!=this.config.asOf&&this.upToDateISOString<this.config.asOf?!1:this.analyticsQuery.hasMorePages()?!0:!1,this.updateVisualization(),null!=this.config.asOf&&this.upToDateISOString<this.config.asOf?void 0:this.analyticsQuery.hasMorePages()?this.onNewDataAvailable():this.newDataExpected(void 0,this.config.refreshIntervalMilliseconds)},e.prototype.newDataExpected=function(t,e){var r;return null==t&&(t=3e4),null==e&&(e=18e5),this.config.trace&&console.log("in VisualizerBase.newDataExpected"),r=e+t,null!=this.timeoutHandle&&clearTimeout(this.timeoutHandle),this.timeoutHandle=setTimeout(this.onNewDataAvailable,r)},e.prototype.removeFromCacheAndRecalculate=function(){return this.config.trace&&console.log("in VisualizerBase.removeFromCacheAndRecalculate"),this.upToDateISOString=null,this.cache.removeItem(this.getHashForCache()),this.onConfigOrScopeUpdated()},e.prototype.updateCalculator=function(){var t,e,r,i,s,a;return i=arguments[0],s=arguments[1],t=arguments[2],e=arguments.length>=4?o.call(arguments,3):[],this.config.trace&&console.log("in VisualizerBase.updateCalculator"),(a=this.lumenizeCalculator).addSnapshots.apply(a,[i,s,t].concat(o.call(e))),r=this.lumenizeCalculator.getStateForSaving(),this.cache.setItem(this.getHashForCache(),r)},e.prototype.initialize=function(){return this.dirty=!0,this.virgin=!0,this.config.trace&&console.log("in VisualizerBase.initialize"),null==this.config.lumenizeCalculatorConfig&&(this.config.lumenizeCalculatorConfig={}),this.config.lumenizeCalculatorConfig.workDays=this.workspaceConfiguration.WorkDays,null!=this.userConfig.tz?this.config.lumenizeCalculatorConfig.tz=this.userConfig.tz:(this.config.tz=this.workspaceConfiguration.TimeZone,this.config.lumenizeCalculatorConfig.tz=this.workspaceConfiguration.TimeZone)},e.prototype.deriveFieldsOnSnapshots=function(t){return this.config.trace&&console.log("in VisualizerBase.deriveFieldsOnSnapshots"),null!=this.config.deriveFieldsOnSnapshotsConfig?Lumenize.deriveFields(t,this.config.deriveFieldsOnSnapshotsConfig):void 0},e.prototype.createVisualization=function(){return this.config.trace&&console.log("in VisualizerBase.createVisualization. @dirty: ",this.dirty),this.updateVisualizationData(),this.createVisualizationCB(this.visualizationData)},e.prototype.updateVisualization=function(){return this.config.trace&&console.log("in VisualizerBase.updateVisualization. @dirty: ",this.dirty),this.updateVisualizationData(),this.dirty||this.virgin?(this.dirty=!1,this.virgin=!1,this.createVisualizationCB(this.visualizationData)):void 0},e.prototype.onNewDataAvailable=function(){return this.config.trace&&console.log("in VisualizerBase.onNewDataAvailable"),this.fetchPending=!0,this.analyticsQuery.getPage(this.onSnapshotsReceieved)},e.prototype.updateVisualizationData=function(){return this.config.trace?console.log("in VisualizerBase.updateVisualizationData"):void 0},e.prototype.getHashForCache=function(){return this.config.trace?console.log("in VisualizerBase.getHashForCache"):void 0},e}(),this.VisualizerBase=e}).call(this);
</script>

<script type="text/javascript">
(function(){var t,e,i,r=function(t,e){return function(){return t.apply(e,arguments)}},o={}.hasOwnProperty,s=function(t,e){function i(){this.constructor=t}for(var r in e)o.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};e="undefined"!=typeof exports&&null!==exports?require("../lib/lumenize"):require("/lumenize"),i=e.utils,t=function(t){function o(){return this.onNewDataAvailable=r(this.onNewDataAvailable,this),o.__super__.constructor.apply(this,arguments)}return s(o,t),o.prototype.initialize=function(){var t,r,s,a,l,u,c;for(this.config.trace&&console.log("in TIPVisualizer.initialize"),o.__super__.initialize.call(this),this.config.toolTipFieldNames=[],u=this.config.showTheseFieldsInToolTip,a=0,l=u.length;l>a;a++)r=u[a],t="string"===i.type(r)?r:r.field,this.config.toolTipFieldNames.push(t);return s=["_ValidTo"].concat(this.config.toolTipFieldNames),c=this.config.radiusField.field,0>n.call(s,c)&&s.push(this.config.radiusField.field),this.config.lumenizeCalculatorConfig.trackLastValueForTheseFields=s,this.config.lumenizeCalculatorConfig.granularity="hour",this.config.lumenizeCalculatorConfig.workDayStartOn=this.config.workDayStartOn,this.config.lumenizeCalculatorConfig.workDayEndBefore=this.config.workDayEndBefore,this.config.lumenizeCalculatorConfig.holidays=this.config.holidays,this.config.lumenizeCalculatorConfig.workDays=this.config.workDays,this.LumenizeCalculatorClass=e.TimeInStateCalculator},o.prototype.onNewDataAvailable=function(){var t;return this.config.trace&&console.log("in TIPVisualizer.onNewDataAvailable"),t={"X-RallyIntegrationName":"TIP Chart (prototype)","X-RallyIntegrationVendor":"Rally Red Pill","X-RallyIntegrationVersion":"0.2.0",workspaceOID:this.projectAndWorkspaceScope.workspaceOID},null==this.upToDateISOString&&(this.upToDateISOString="2011-12-01T00:00:00.000Z"),this.analyticsQuery=new TimeInStateAnalyticsQuery(t,this.upToDateISOString,this.config.statePredicate),this.projectAndWorkspaceScope.projectScopingUp?(this.config.debug&&console.log("Project scoping up. OIDs in scope: ",this.projectAndWorkspaceScope.projectOIDsInScope),this.analyticsQuery.scope("Project",this.projectAndWorkspaceScope.projectOIDsInScope)):this.projectAndWorkspaceScope.projectScopingDown?(this.config.debug&&console.log("Project scoping down. Setting _ProjectHierarchy to: ",this.projectAndWorkspaceScope.projectOID),this.analyticsQuery.scope("_ProjectHierarchy",this.projectAndWorkspaceScope.projectOID)):(this.config.debug&&console.log("Project with no up or down scoping. Setting Project to: ",this.projectAndWorkspaceScope.projectOID),this.analyticsQuery.scope("Project",this.projectAndWorkspaceScope.projectOID)),this.analyticsQuery.type(this.config.type).fields(this.config.toolTipFieldNames),this.config.leafOnly&&this.analyticsQuery.leafOnly(),null!=this.config.asOf&&this.analyticsQuery.additionalCriteria({_ValidFrom:{$lt:this.getAsOfISOString()}}),this.config.debug&&(this.analyticsQuery.debug(),console.log("Requesting data...")),this.fetchPending=!0,this.analyticsQuery.getPage(this.onSnapshotsReceieved)},o.prototype.getHashForCache=function(){var t,e,r,o,s;return this.config.trace&&console.log("in TIPVisualizer.getHashForCache"),t={},s=i.clone(this.userConfig),delete s.debug,delete s.daysToShow,delete s.showStillInProgress,t.userConfig=s,t.projectAndWorkspaceScope=this.projectAndWorkspaceScope,t.workspaceConfiguration=this.workspaceConfiguration,o="TIP v0.2.86",e=JSON.stringify(t),r=md5(e+o)},o.prototype.updateVisualizationData=function(){var t,i,r,o,s,n,a,l,u,c,h,p,g,f,d,y,_,m,S,A,v,C,w,D,z,I,R,O,T,P,k,V,F,b,E,M;if(this.config.trace&&console.log("in TIPVisualizer.updateVisualizationData"),s=this.lumenizeCalculator.getResults(),0===s.length){if(this.config.debug&&console.log("No calculatorResults."),this.fetchPending)return this.config.debug&&console.log("fetchPending is true so returning with visualizationData = null."),this.visualizationData=null,void 0;_=[],this.config.debug&&console.log("fetchPending is false so filling in with blanks")}else{for(this.virgin=!1,p=[],d=[],t=null!=this.config.asOf?new e.Time(this.config.asOf,"millisecond").getJSDate(this.config.lumenizeCalculatorConfig.tz).getTime():(new Date).getTime(),f=24*60*60*1e3*this.userConfig.daysToShow,m=t-f,w=0,R=s.length;R>w;w++)y=s[w],g=new e.Time(y._ValidTo_lastValue,"millisecond").getJSDate(this.config.lumenizeCalculatorConfig.tz).getTime(),y.x=g>t?t:g,y.x-=24*60*60*1e3*Math.random(),null!=this.config.radiusField&&(y.marker={radius:this.config.radiusField.f(y[this.config.radiusField.field+"_lastValue"])}),g>m&&(t>g?d.push(y):p.push(y));for(S=60*this.config.workDayStartOn.hour,(null!=(E=this.config.workDayStartOn)?E.minute:void 0)&&(S+=this.config.workDayStartOn.minute),l=60*this.config.workDayEndBefore.hour,(null!=(M=this.config.workDayEndBefore)?M.minute:void 0)&&(l+=this.config.workDayEndBefore.minute),l>S?C=l-S:(C=1440-S,C+=l),v=C/60,D=0,O=p.length;O>D;D++)y=p[D],y.days=y.ticks/v;for(z=0,T=d.length;T>z;z++)y=d[z],y.days=y.ticks/v}if(h=e.histogram(d,"days"),null==h)return this.config.debug&&console.log("No histogramResults. Returning."),void 0;for(o=h.buckets,n=h.chartMax,A=h.valueMax,r=h.bucketSize,a=h.clipped,I=0,P=d.length;P>I;I++)y=d[I],y.y=y.clippedChartValue;for(F=0,k=p.length;k>F;F++)y=p[F],y.y=y.days>n?n:y.days;for(u=[],c=[],b=0,V=o.length;V>b;b++)i=o[b],u.push(i.label),c.push(i.count);return _=[{name:"Not in Process",data:d},{name:"In Process",data:p},{name:"Percentile",data:[],yAxis:1,showInLegend:!1}],this.visualizationData={series:_,histogramResults:h,histogramCategories:u,histogramData:c,startMilliseconds:m,asOfMilliseconds:t}},o}(VisualizerBase),this.TIPVisualizer=t}).call(this);
</script>

        <script type="text/javascript">
            (function() {

                var charts = {};
                var visualizer;

                createVisualization = function(visualizationData) {

                  if (typeof visualizationData !== "undefined" && visualizationData !== null) {

                    var series = visualizationData.series;
                    var histogramResults = visualizationData.histogramResults;
                    var startMilliseconds = visualizationData.startMilliseconds
                    var asOfMilliseconds = visualizationData.asOfMilliseconds

                    var histogramCategories = visualizationData.histogramCategories;
                    var histogramData = visualizationData.histogramData;

                    var bucketSize = histogramResults.bucketSize;
                    var chartMax = histogramResults.chartMax;
                    var buckets = histogramResults.buckets;
                    var clipped = histogramResults.clipped;
                    var valueMax = histogramResults.valueMax;

                    charts.scatterChart = new Highcharts.Chart({
                      chart: {
                         renderTo: 'scatter-container',
                         defaultSeriesType: 'scatter',
                         zoomType: 'x',
                         marginTop: 80
                      },
                      legend: {
                         enabled: true,
                         floating: true,
                         align: 'center',
                         verticalAlign: 'top',
                         y: 37
                      },
                      credits: {
                         enabled: false
                      },
                      title: {
                         text: 'Time In Process'
                      },
                      subtitle: {
                         text: userConfig.subTitle
                      },
                      xAxis: {
                         startOnTick: false,
                         tickmarkPlacement: 'on',
                         title: {
                             enabled: false
                         },
                         type: 'datetime',
                         min: startMilliseconds,
                         max: asOfMilliseconds
                      },
                      yAxis: [
                         {
                             title: {
                                 text: 'Time In Process (Work Days)'
                             },
                             opposite: false,
                             endOnTick: false,
                             tickInterval: bucketSize,
                             labels: {
                               formatter: function() {
                                   if (this.value !== 0) {
                                     if (this.value == chartMax) {
                                       if (clipped) {
                                         return '' + valueMax + '*';
                                       } else {
                                         return chartMax;
                                       }
                                     } else {
                                       return this.value;
                                     }
                                   }
                                 }

                             },
                             min: 0,
                             max: chartMax
                         },
                         {
                             title: {
                                 text: null
                             },
                             opposite: true,
                             // endOnTick: true,
                             tickInterval: 1,
                             labels: {
                                 formatter: function() {
                                    if (this.value !== 0) {
                                      return Highcharts.numberFormat(buckets[this.value - 1].percentile * 100, 1) + "%";
                                    } else {
                                      return "0.0%";
                                    }
                                  }
                             },
                             min: 0,
                             max: buckets.length
                         }

                      ],
                      tooltip: {
                         formatter: function() {
                             var point = this.point;
                             tooltip = 'ObjectID: ' + point.ObjectID + '<br />';  // !TODO: Upgrade to link to revisions page in Rally
                             tooltip += this.series.name + ': <b>' + Highcharts.numberFormat(point.days, 1) + '</b> work days';
                             var t, _i, _len, _ref, f, field, as;
                             _ref = userConfig.showTheseFieldsInToolTip;
                             for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                t = _ref[_i];
                                if (typeof t === 'string') {
                                  field = t;
                                  f = function(value) {
                                    return value;
                                  };
                                  as = t;
                                } else {
                                  field = t.field;
                                  if (t.f != null) {
                                    f = t.f;
                                  } else {
                                    f = function(value) {
                                      return value;
                                    };
                                  }
                                  if (t.as != null) {
                                    as = t.as;
                                  } else {
                                    as = t.field;
                                  }
                                }
                                tooltip += '<br />' + as + ': ' + f(point[field + "_lastValue"]);
                             }
                             return tooltip;
                         }
                      },
                      plotOptions: {
                          scatter: {
                             marker: {
                                states: {
                                   hover: {
                                      enabled: false
                                   }
                                }
                             }
                          },
                          series: {
                              events: {
                                  legendItemClick: function(event) {
                                      if (this.index == 0) {
                                          if (!this.visible) {
                                             this.chart.xAxis[0].setExtremes(startMilliseconds, asOfMilliseconds, false);
                                          } else {
                                             this.chart.xAxis[0].setExtremes(asOfMilliseconds - 24 * 60 * 60 * 1000, asOfMilliseconds, false);
                                          };
                                          this.chart.redraw();
                                      };
                                      return true;
                                  }
                              }
                          }
                      },
                      series: series
                    }, function(chart) {
                        if (clipped) {
                          chart.renderer.text('* non-linear', 57, 55).add();
                        };
                        if (series[0].data.length == 0) {
                          chart.renderer.text('No matching data for this project and scope.', chart.chartWidth / 2 - 127, chart.chartHeight / 2 - 100).add();
                        }
                    });  // end of scatterChart

                    charts.histogramChart = new Highcharts.Chart({
                   		chart: {
                   			renderTo: 'histogram-container',
                   			type: 'bar',
                   			marginTop: 80
                   		},
                       legend: {
                         enabled: false
                       },
                       credits: {
                           enabled: false
                       },
                   		title: {
                   			text: 'Histogram'
                   		},
                   		subtitle: {
                   			text: 'for Not In Process'
                   		},
                   		xAxis: [{ // mirror axis on right side
                   			opposite: false,
                   			reversed: false,
                   			categories: histogramCategories,
                   		}],
                   		yAxis: {
                   			title: {
                   				text: null
                   			},
                         labels: {
                   				formatter: function(){
                   					return Math.abs(this.value);
                   				}
                   			},
                   			min: 0
                   		},
                   		plotOptions: {
                   			series: {
                   				stacking: 'normal'
                   			}
                   		},
                   		tooltip: {
                   			formatter: function(){
                   				return '' + this.point.category +' work days: <b>' + Highcharts.numberFormat(Math.abs(this.point.y), 0) + '</b>';
                   			}
                   		},
                   		series: [{
                   			name: 'Time in process',
                   			data: histogramData
                   		}]
                   	}, function(chart) {
                   	     if (false) {
                            chart.renderer.text('* non-linear', 200, 65).add();
                          };
                    });  // end of histogramChart

                  } else {
                    // Put a spinner in the chart containers until first fetch returns
                    $('#scatter-container')
                      .html('<img height="20px" src="https://rally1.rallydev.com/slm/js-lib/ext/2.2/resources/images/default/grid/loading.gif"></img>')
                      .attr("style", "text-align:center");
                    $('#histogram-container')
                      .html('<img height="20px" src="https://rally1.rallydev.com/slm/js-lib/ext/2.2/resources/images/default/grid/loading.gif"></img>')
                      .attr("style", "text-align:center");
                  };  // end of if visualizationData?

                };  // end of createVisualization


                $(document).ready(function() {
                  visualizer = new TIPVisualizer(charts, userConfig, createVisualization);
                });

            })();


        </script>


    </head>
    <body>

        <!-- 3. Add the containers -->
        <table cellpading="0px" cellspacing="0px" width="98%" height="98%">
          <tr>
            <td width="65%"><div id="scatter-container" style="width: 100%; height: 100%; margin: 0 auto"></div></td>
            <td width="35%"><div id="histogram-container" style="width: 100%; height: 100%; margin: 0 auto"></div></td>
          </tr>
        </table>

    </body>
</html>