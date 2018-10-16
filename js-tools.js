var jst = {

    /**
     * Types that JS Tools comes with
     */
    type : { // JS Tool Types

        //
        // datatype / Datentypen fest definieren
        //

        Integer : function(number){

            if(typeof number === 'string')
                number = number
                    .replace(',','.')
                    .replace(/[^0-9.]|\s/g,"");

            if(!jst.Checker.isset(number) || !number) number = 0;
            else if(number === true) number = 1;
            else if(isNaN(parseInt(number)))
                throw new jst.type.JSException('[Integer] Ungueltiger Parameter im Konstruktor!');

            this.value = parseInt(number);
        },

        Float : function(number){

            if(typeof number === 'string')
                number = number
                    .replace(',','.')
                    .replace(/[^0-9.]|\s/g,"");

            if(!jst.Checker.isset(number) || !number) number = 0.0;
            else if(number === true) number = 1.0;
            else if(isNaN(parseFloat(number)))
                throw new jst.type.JSException('[Float] Ungueltiger Parameter im Konstruktor! Zahl kann nicht konvertiert werden!');

            this.value = parseFloat(number);
        },

        String : function(string){
            if(string == null) string = 'null';
            else if(jst.Checker.is_empty(string)) string = "";

            this.value = string.toString();
        },

        Boolean : function(boolean){
            this.value = !!boolean;
        },

        Object : function(object){

            if(typeof object === 'object' && object.length === 'undefined'){
                this.value = object;
            } else {
                throw new jst.type.JSException('[Object] Ungueltiger Parameter beim Konstruktor! Es wird ein Objekt erwartet!');
            }

        },

        Array : function(array){

            if(typeof array === 'object' && array.length !== 'undefined'){
                this.value = array;
            } else {
                throw new jst.type.JSException('[Array] Ungueltiger Parameter beim Konstruktor! Es wird ein Array erwartet!');
            }

        },

        //
        // math / Mathematische Strukturen
        //

        Range : function(from,to){ // Von-Bis Angabe
            this.from = new jst.type.Float(from).value;
            this.to = new jst.type.Float(to).value;
        },

        Vector2D : function(x,y){ // 2D Koordinate
            this.x = x;
            this.y = y;
        },

        Percent : function(float_from_zero_to_one){

            float_from_zero_to_one = float_from_zero_to_one > 1 ? 1 : float_from_zero_to_one;
            float_from_zero_to_one = float_from_zero_to_one < 0 ? 0 : float_from_zero_to_one;

            this.value = float_from_zero_to_one;

        },

        //
        // exceptions / Fehlerobjekte
        //

        JSException : function(message,code,data,callback){

            this.message = typeof message === 'undefined' ? 'No errortext set' : message;
            this.code = typeof code === 'undefined' ? 0 : code;
            this.data = typeof data !== 'object' ? {} : data;
            this.callback = typeof callback !== 'function' ? function(){} : callback;

        },

        //
        // Check Funktion und Namens Referenz
        //

        /**
         * Check function for Types
         *
         * Checkt ob ein Wert einen bestimmten Datentyp entspricht (Klasse).
         * @param value mixed - Der Wert oder die Variable die geprueft werden soll
         * @param typename string - Der Datetyp den der Wert entsprechen soll
         * @param show_console_error boolean - Soll ein Fehler in der Konsole ausgegeben werden wenn der Typ nicht stimmt
         */
        check : function(value,typename,show_console_error){

            typename = typename.toLowerCase();

            if(typeof jst.type.names[typename] === 'undefined'){
                console.error("[TypeChecker] Undefined Typereference: " + typename);
                return false;
            }

            if(value instanceof jst.type.names[typename]) {

                return true;
            } else {

                if(show_console_error) console.error("[TypeChecker] Structure (jst type) expected: " + typename);
                return false;
            }

        },

        // Internal --->
        names : { // REFERENZ - Only internal usage - do not think about this part , you wont need it

            // Add new Types here for the TypeChecker

            get integer()       {   return jst.type.Integer  },
            get int()           {   return jst.type.Integer  },
            get float()         {   return jst.type.Float    },
            get boolean()       {   return jst.type.Boolean  },
            get bool()          {   return jst.type.Boolean  },
            get bit()           {   return jst.type.Boolean  },
            get string()        {   return jst.type.String   },
            get object()        {   return jst.type.Object   },
            get array()         {   return jst.type.Array    },

            get range()         {   return jst.type.Range    },
            get vector2d()      {   return jst.type.Vector2D },
            get percent()       {   return jst.type.Percent  },

            get jsexception()   {   return jst.type.JSException }

        }

    },

    // Static JS Tool Classes ( No instance needed )

    /**
     * Class
     * Formatiert diverse Formate
     */
    Formatter : new function(){

        var self = this;

        /**
         * Konvertiert einen String oder eine Zahl selbst
         * in eine Nummer. Bei Fehler kommt null zurueck
         * @param number_string string - Zahl die in eine Nummer konvertiert werden soll
         * @returns number|null - on error or not possible null
         */
        self.to_number = function( number_string ){

            if(jst.type.check.is_number(number_string))
                return Number(number_string.toString()
                    .replace(',','.')
                    .replace(/[^0-9][\\.]/g,'')
                );

            else return null;

        };

        /**
         * Fuellt eine Mitgegebene Nummer soweit mit Nullen davor auf, dass sie eine einheitliche Laenge bekommt.
         * @param number int - Die Nummer selbst
         * @param number_length int - Aus wievielen Zahlen die Nummer bestehen soll ( Laenge des Zahlenstrings )
         * @returns string - Die Zahl mit Nullen aufgefuellt falls es notwendig war
         */
        self.zerofill = function( number , number_length ){

            // Zahl in String
            var number_zerofilled = number.toString();

            // Wenn String zu Kurz ist : String mit ein paar 0'en davor ergaenzen
            for(var i = 0; i < number_length; i++) number_zerofilled = '0'+number_zerofilled;

            // Ausgabe und soviele Nullen davor abschneiden bis die gewuenschte laenge erreicht ist
            return number_zerofilled.slice(-number_length);

        };

        /**
         * Gibt einen einheitlichen String mit Datum + Uhrzeit zurueck
         * @param dateobject Date - Optional - Standard: Aktuelle Zeit - Datums Objekt von JavaScript
         * @param iso_date_format boolean - Optional - Default: false - In US (ISO) Format ausgeben oder EU Format
         * @returns string - Datetime
         */
        self.get_datetimestring = function(dateobject , iso_date_format){

            return this.get_datestring(dateobject,iso_date_format) + " " + this.get_timestring(dateobject);

        };

        /**
         * Gibt einen einheitlichen String mit Datum zurueck
         * @param dateobject Date - Optional - Standard: Aktuelle Zeit - Datums Objekt von JavaScript
         * @param iso_date_format boolean - Optional - Soll das Datum im US Format ausgegeben werden
         * @returns string Date
         */
        self.get_datestring = function(dateobject , iso_date_format){

            if (typeof dateobject === 'undefined' || dateobject === null) dateobject = new Date();
            if (typeof iso_date_format === 'undefined' || iso_date_format === null) iso_date_format = false;

            if(iso_date_format){

                return this.zerofill(dateobject.getFullYear(),4)
                    + "-"
                    + this.zerofill((dateobject.getMonth()+1),2)
                    + "-"
                    + this.zerofill(dateobject.getDate(), 2);

            } else {

                return this.zerofill(dateobject.getDate(), 2)
                    + "."
                    + this.zerofill((dateobject.getMonth()+1),2)
                    + "."
                    + this.zerofill(dateobject.getFullYear(),4);

            }



        };


        /**
         * Gibt einen einheitlichen String mit Uhrzeit zurueck
         * @param dateobject Date - Optional - Standard: Aktuelle Zeit - Datums Objekt von JavaScript
         * @param display_seconds boolean - Optional - Sollen Sekunden angezeigt werden (Default: true)
         * @returns string Time
         */
        self.get_timestring = function(dateobject , display_seconds){

            if (typeof dateobject === 'undefined' || dateobject === null) dateobject = new Date();
            if (typeof display_seconds === 'undefined' || display_seconds === null) display_seconds = true;

            if(display_seconds){

                return this.zerofill(dateobject.getHours(),2)
                    + ":"
                    + this.zerofill(dateobject.getMinutes(),2)
                    + ":"
                    + this.zerofill(dateobject.getSeconds(),2);

            } else {

                return this.zerofill(dateobject.getHours(),2)
                    + ":"
                    + this.zerofill(dateobject.getMinutes(),2);

            }

        }

    },

    /**
     * Class
     * Daten Checker
     */
    Checker : new function(){

        var self = this;

        /**
         * Prueft ob ein Wert eine Nummer ist oder nicht
         * @param value mixed
         * @returns boolean
         */
        self.is_number = function( value ){

            return (!isNaN(value) && value !== null && value.toString().trim() !== '');

        };

        /**
         * Prueft ob eine Variable einen Wert enthaelt
         * @param value
         * @return {boolean}
         */
        self.isset = function( value ){

            return !(typeof value === 'undefined' || value === null);

        };

        /**
         * Prueft ob eine Variable leer oder undefiniert ist
         * @param value
         * @return {boolean}
         */
        self.is_empty = function( value ){

            return ( !self.isset(value)
                || value.toString().trim() === ''
                || (typeof value === 'array' && jst.Calculator.count(value) === 0)
                || (typeof value === 'object' && jst.Calculator.count(value) === 0)
            );

        };

        /**
         * Sucht eine genaue uebereinstimmung eines Keys mit dem Suchwort in einem Object
         * @param key string|number
         * @param object
         * @returns {boolean}
         */
        self.is_key_in_object = function( key , object ){

            for(var word in object)
                if(word === key)
                    return true;

            return false;

        };

        /**
         * Prueft ob ein Wert in einem Array vorhanden ist
         * @param value
         * @param array array
         * @return {boolean}
         */
        self.is_in_array = function( value , array ){

            return array.indexOf(value) > -1;

        }

    },

    /**
     * Class
     * Ein Taschenrechner fuer diverse einfache Rechenoperationen
     */
    Calculator : new function(){

        var self = this;

        /**
         * Gibt den Prozentwert aus von Werten zwischen einem bestimmten Bereich
         * @param float STRUCT.datatype.Float - Gleitkommazahl
         * @param range STRUCT.math.Range - Von bis Range
         */
        self.percent = function( float , range ){

            if(!jst.type.check(float, 'float',true)) return false;
            if(!jst.type.check(range, 'range',true)) return false;

            return (float.value-range.from)/(range.to-range.from)*100;

        };

        /**
         * Gibt auf einer Skala von 0 - 100 die Einstufung des mitgegebenes Wertes anhand
         * der auch mitgegebenen MIN und MAX Werte aus
         * @param min number
         * @param max number
         * @param value number
         */
        self.ratio = function( min , max , value ){

            value = value - min;
            max = max - min;
            return value/max * 100;

        };

        /**
         * Summiert alle Zahlen in einem Eindimensionalen Array zusammen
         * @param array
         */
        self.sum = function( array ){

            var sum = 0;
            for(var index in array){
                var val = array[index];
                if(jst.Checker.is_number(val)){
                    val = Number(val);
                    sum += val;
                }
            }
            return sum;

        };

        /**
         * Zaehle alle Eintraege in einem Objekt oder Array und gebe die Anzahl zurueck
         * @param object_or_array object|array
         * @returns {number}
         */
        self.count = function( object_or_array ){

            var count = 0;
            for(var i in object_or_array){
                count++;
            }
            return count;

        };

        /**
         * Gibt den Durchschnitt vom Array aus
         * @param array
         * @rerutn {number}
         */
        self.avg = function( array ){

            return self.sum(array)/self.count(array);

        };

        /**
         * Gibt den Maximalsten Wert aus einem Object oder Array
         * @param object_or_array
         * @return {number}
         */
        self.max = function( object_or_array ){

            var max = null;
            for(var i in object_or_array){
                var val = object_or_array[i];
                if(max === null) max = val;
                if(jst.Checker.is_number(val)){
                    val = Number(val);
                    if(val > max) max = val;
                }
            }
            return max;

        };

        /**
         * Gibt den Minimalsten Wert aus einem Object oder Array
         * @param object_or_array
         * @return {number}
         */
        self.min = function( object_or_array ){

            var min = null;
            for(var i in object_or_array){
                var val = object_or_array[i];
                if(min === null) min = val;
                if(jst.Checker.is_number(val)) {
                    val = Number(val);
                    if (val < min) min = val;
                }
            }
            return min;

        };

        /**
         * Kreisumfang ausgeben anhand des Radius. Hilfreich fuer SVG Grafiken bei den Attributen
         * stroke-dasharray und stroke-dashoffset.
         * @param float_radius jst.type.Float - Kreisradius
         * @param percent jst.type.Percent - Prozent der Kreisfuellung
         * @return {number} - Circumference
         */
        self.circumference = function( float_radius , percent ){

            float_radius = jst.type.check(float_radius , "float") ? float_radius : new jst.type.Float(10);
            percent = jst.type.check(percent , "percent") ? percent : new jst.type.Percent(1.0);

            return 2 * Math.PI * float_radius.value * percent.value;

        }

    },

    /**
     * Class
     * HTML Dom Manipulationen und Checks
     */
    Dom : new function(){

        var self = this;

        /**
         * Prueft ob das Node Element eine Kindelement des eigenen ist
         * @param child_node HTMLElement - Child Node to check
         * @param parent_node HTMLElement - Parent Node to check
         * @return {boolean}
         */
        self.is_child = function( child_node , parent_node ){

            var is_child = false;
            var max_loop = 5000; // Maximale Loop Begrenzung um Aufhaengen zu vermeiden
            var i = 0;

            while(true){

                if(typeof child_node.parentNode === 'undefined' || child_node.parentNode === null){
                    break;
                }

                if(child_node === parent_node){
                    is_child = true;
                    break;
                }

                child_node = child_node.parentNode;

                if(i >= max_loop) break;
                i++;
            }

            return is_child;

        };

        /**
         * Ersetzt eine Element mit einem Anderen
         * @param old_node Node
         * @param new_node Node
         * @return new_node Node
         */
        self.replace_element = function( old_node , new_node ){

            old_node.parentNode.insertBefore(new_node,old_node);
            old_node.parentNode.removeChild(old_node);
            return new_node;

        }

        /**
         * Fuegt einen Klassennamen zum HTML Element hinzu
         * @param node_element HTMLElement - Node Element
         * @param classname string - Klassenname der hinzugefuegt werden soll
         */
        self.add_class = function( node_element , classname ){

            var classnames = node_element.className.split(' ');
            if(!jst.Checker.is_in_array(classname , classnames))
                classnames.push(classname);

            node_element.className = classnames.join(" ").trim();

        };

        /**
         * Entfernt einen Klassennamen von einem HTML Element
         * @param node_element HTMLElement - Node Element
         * @param classname string - Klassename der entfernt werden soll
         */
        self.remove_class = function( node_element , classname ){

            var classnames = new jst.classes.ArrayManager(node_element.className.split(' '));
            if(classnames.value_exists(classname))
                classnames.remove(classnames.get_index(classname));

            if(classnames.array.length === 0) node_element.removeAttribute('class');
            else node_element.className = classnames.array.join(" ").trim();

        };

        /**
         * Selektiert ein HTML Element per ID
         * @param node_id string - Node ID
         * @return {Node} HTML Element ( Node )
         */
        self.get_by_id = function( node_id ){

            return document.getElementById(node_id);

        };

        /**
         * Selektiert alle Node Elemente und gibt sie zurueck
         * @param selector string - Dom Selektor
         * @return Node[] - Node im Objekt
         */
        self.get = function( selector ){

            var nodes = [];

            var selection = document.querySelectorAll( selector );
            for(var i in selection){
                if(jst.Checker.is_number(i)) nodes.push(selection[i]);
            }

            return nodes;

        };

        /**
         * Entfernt ein Node Element aus dem DOM
         * @param node_element HTMLElement - Node Element
         * @returns Node HTMLElement - Node Element
         */
        self.remove = function( node_element ){

            return node_element.parentNode.removeChild(node_element);

        }

        /**
         * Entfernt alle Styles die im Node Element zusatzlich eingetragen wurden (inline)
         * @param node_element Node - Node Element
         */
        self.clear_style = function( node_element ){

            node_element.removeAttribute('style');

        };

        /**
         * Erstellt ein HTML Element und gibt es als Objekt zurueck
         * @param tagtype string - Element Type
         * @param element_attributes object - List: Attribute-Name => Attribute-Value
         * @param element_events object - List: Event-Name => Function
         */
        self.create_element = function( tagtype , element_attributes , element_events , target_selector ){

            tagtype = jst.Checker.isset(tagtype) ? tagtype : 'div';
            element_attributes = typeof element_attributes === 'object' ? element_attributes : {};
            element_events = typeof element_events === 'object' ? element_events : {};

            var element = document.createElement(tagtype);

            element.destroy = function(){
                element.parentNode.removeChild(element);
            };

            for(var key in element_attributes){
                element.setAttribute(key , element_attributes[key]);
            }

            for(var key in element_events){
                element.addEventListener(key , element_events[key]);
            }

            if(jst.Checker.isset(target_selector)){

                document.querySelector(target_selector).appendChild(element);

            }

            return element;

        };


    },

    /**
     * Class
     * Extra Funktionen
     *
     * Not clear where to put these functions in
     * so its a Placeholder for now
     */
    Extras : new function(){

        var self = this;

        /**
         * Funktion die solange wartet bis eine Bedingung eintrifft
         * @param check_func function - Die Funktion, welche die Bedingung checkt und TRUE oder FALSE zurueckgeben MUSS
         * @param on_ready_func - Wenn die Bedingung erfuellt ist
         * @param wait_intervall_in_ms - Die Sequenz wann immer gescheckt werden soll (alle X Millisekunden)
         */
        self.wait_until = function( check_func , on_ready_func , wait_intervall_in_ms ){

            wait_intervall_in_ms = typeof wait_intervall_in_ms === 'undefined' ? 5 : wait_intervall_in_ms;

            var self = this;

            setTimeout(function(){

                if(check_func()){
                    on_ready_func();
                } else {
                    self.wait_until(check_func,on_ready_func,wait_intervall_in_ms);
                }

            },wait_intervall_in_ms);

        };

        /**
         * Gibt eine Zufaellige ID zurueck
         * @param hex_blocks Number - Count of Hex-Numeric Blocks that will be chained
         * @returns {string}
         */
        self.get_random_id = function(hex_blocks){

            if(typeof hex_blocks === 'undefined') hex_blocks = 3;

            var id = (Math.floor(Math.random() * 0x1000000) + 1).toString(16);

            for(var i = 1 ; i < hex_blocks ; i++){

                id += "-" + (Math.floor(Math.random() * 0x1000000) + 1).toString(16);

            }

            return id;

        };


    },

    /**
     * JS Tool Classes for indicidual Instances
     */
    classes : {

        /**
         * Class
         * Eine LocalStorage Manager um JavaScript LocalStorage besser managen zu koennen
         * @constructor
         */
        LocalStorageManager : function( storage_key ){

            var self = this;

            /**
             * Konstruktor
             * @param storage_key string - Key zum refernzieren
             * @return {boolean}
             */
            self.construct = function(storage_key){

                if(!jst.Checker.isset(storage_key) && typeof storage_key !== 'string'){
                    console.error("[JST] LocalStorageManager - Cant create instance without a storage key in constructor (Argument 1)");
                    return false;
                }

                self.storage_key = storage_key;
                self.default_object = {}; // Standard Objekt

            };

            /**
             * Holt ein Objekt aus dem LocalStorage
             * @param storage_key string - LocalStorage Key Name
             */
            self.get_objekt = function(){

                var objekt = null;

                if(localStorage.getItem(this.storage_key) !== null){

                    try {

                        objekt = JSON.parse(localStorage.getItem(this.storage_key));

                    } catch(e){}

                }

                return objekt;

            };

            /**
             * Holt ein Wert anhand des Keys aus einem LocalStorage Objekt
             * @param object_key string - Key Name im LocalStorage Objekt
             */
            self.get_objekt_key = function( object_key ){

                if(localStorage.getItem(this.storage_key) !== null){

                    var objekt = self.get_objekt();
                    if(objekt !== null && typeof objekt[object_key] !== 'undefined') return objekt[object_key];
                    else return null;

                }

            };

            /**
             *  Setzte einen Objekt zum LocalStorage key
             * @param object object - Ein Objekt das lokal gespeichert werden soll
             */
            self.set_objekt = function (object){

                console.log("New Obj",object);

                if(typeof object !== 'object') console.error("Object expected!");
                else localStorage.setItem(this.storage_key, JSON.stringify(object) );

            };

            /**
             *  Setzte einen Objekt anhand eines Keys im LocalStorage Objekt
             * @param storage_key string - LocalStorage -> Key Name
             * @param object_key string - LocalStorage -> Objekt -> Key Name
             * @pram value mixed - Der Wert der gespeichert werden soll
             */
            self.set_objekt_key = function( object_key, value){

                if(localStorage.getItem(this.storage_key) !== null){

                    var objekt = JSON.parse(localStorage.getItem(this.storage_key));
                    objekt[object_key] = value;
                    self.set_objekt(objekt);

                } else {

                    var objekt = self.default_object;
                    objekt[object_key] = value;
                    self.set_objekt(objekt);

                }

            };

            /**
             * Loescht einen Keys aus dem LocalStorage
             * @param storage_key string - LocalStorage Key Name
             */
            self.delete = function(){

                localStorage.removeItem(this.storage_key);

            };

            /**
             * Setzt den Inhalt eines Keys im LocalStorage auf NULL
             * @param storage_key string - LocalStorage Key Name
             */
            self.clear = function(){

                if(self.get_objekt(this.storage_key) !== null)
                    localStorage.setItem(this.storage_key, null);

            };


            self.construct(storage_key);

        },

        /**
         * Class
         * Eine ObjektManager um JavaScript Objekte besser managen zu koennen
         * @param object object - (Optional) Ein Objekt das verwaltet werden soll oder null (Dann wird ein leeres Objekt erzeugt)
         * @param local_key string - (Optional) Local Storage Key
         * @constructor
         */
        ObjectManager : function( object , local_key ){

            var self = this;

            /**
             * Constructor
             * @param object Object - Object to manage
             * @param local_key string - Storage Key if needed
             */
            self.construct = function(object, local_key){

                // Das zu verwaltende Objekt
                self.object = typeof object === 'undefined' ? {} : object;
                // Kopie des Objekts verwenden und nicht das Original
                self.object = self.clone();

                // Lokales Speichermanagement Key
                local_key = !jst.Checker.isset(local_key) ? null : local_key;
                // Lokales Speichermanagement
                if(local_key !== null)
                    self.localStorageManager = new jst.classes.LocalStorageManager(local_key);
                else
                    self.localStorageManager = null;

            };

            /**
             * Neuen Key zum Objekt hinzufuegen
             * @param key string - Key Name
             * @param value mixed - Objekt Wert
             */
            self.add = function(key,value){
                self.object[key] = value;
            };

            /**
             * Loescht einen Eintrag im Objekt (Key:value)
             * @param key string - der Key Name
             */
            self.remove = function(key){
                if(typeof self.object[key] !== 'undefined')
                    delete self.object[key];
            };

            /**
             * Setzt den Key Namen fuer die lokale Speicherung
             * @param key string - der Key Name
             */
            self.set_localstorage_key = function(key_name){

                if(typeof key_name !== 'string') console.error('The key name must be a string!');
                else self.localStorageManager.storage_key = key_name;

            };

            /**
             * Speichert das Objekt im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                if(self.localStorageManager === null) {
                    console.warn('[JST] ObjectManager - Cant save object. No local_key defined in Constructor (Argument 2)');
                    return false;
                } else
                    self.localStorageManager.set_objekt( self.object );

            };

            /**
             * Laedt ein Objekt aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

                if(self.localStorageManager === null) {

                    console.warn('[JST] ObjectManager - Cant load object. No local_key defined in Constructor (Argument 2)');
                    return false;

                } else {

                    var localStorageObject = self.localStorageManager.get_objekt();

                    if(localStorageObject !== null){ // Lokale Daten vorhanden

                        if(self.count() > 0){ // Standardwerte vorhanden -> Merge Objects

                            for(var key in localStorageObject){

                                if(typeof self.object[key] !== 'undefined'){ // Lade vorhandene Werte aus dem Storage

                                    self.object[key] = localStorageObject[key];

                                }

                            }

                        } else {

                            self.object = localStorageObject;

                        }

                    }

                }

            };

            /**
             * Sychronisiert die Daten im Lokal Cache mit dem Objekt welches definiert ist.
             * Neue Keys werden hinzugefuegt und alte entfernt
             * @return boolean - false wenn Fehler
             */
            self.sync = function(){

                self.load();
                self.save();

                return true;

            };

            /**
             * Prueft ob ein Key im Objekt vorhanden sit
             * @param key string - Key Name
             * @return {boolean}
             */
            self.key_exists = function(key){

                return typeof self.object[key] !== 'undefined';

            };

            /**
             * Gibt den Wert hinter einem Key aus
             * @param key string - Key Name
             * @return {*}
             */
            self.get_value = function(key){

                if(typeof self.object[key] !== 'undefined') return self.object[key];
                else return null;

            };

            /**
             * Gibt die Laenge des Objektes aus
             * @return {number}
             */
            self.count = function(){

                var key_count = 0;
                for(var i in self.object) key_count++;
                return key_count;

            };

            /**
             * Sammelt alle Keys und gibt die als Array zurueck
             * @return {Array}
             */
            self.get_keys = function(){

                var keys = [];
                for(var key in self.object) keys.push(key);
                return keys;

            };

            /**
             * Sammelt alle Werte und gibt die als Array zurueck
             * @return {Array}
             */
            self.get_values = function(){

                var values = [];
                for(var key in self.object) values.push(self.object[key]);
                return values;

            };

            /**
             * Vergleiche ob alle Keys in beiden Objekten gleich sind
             * @param other_object object - Das zu vergleichende Objekt
             */
            self.compare_keys = function(other_object){

                var same = true;

                for(var key in other_object){
                    if(typeof self.object[key] === 'undefined') same = false;
                }

                for(var key in self.object){
                    if(typeof other_object[key] === 'undefined') same = false;
                }

                return same;

            };

            /**
             * Vergleich ob alle Keys und Werte in beiden Objekten gleich sind
             * @param other_object object - Das zu vergleichende Objekt
             */
            self.compare_keys_and_values = function(other_object){

                var same = true;

                for(var key in other_object){
                    if(typeof self.object[key] !== 'undefined'){
                        if(other_object[key] !== self.object[key]) same = false;
                    } else same = false;
                }

                for(var key in self.object){
                    if(typeof other_object[key] !== 'undefined'){
                        if(self.object[key] !== other_object[key]) same = false;
                    } else same = false;
                }

                return same;

            };

            /**
             * Dupliziert das Objekt ohne eine Verbindung beizubehalten
             * @returns object
             */
            self.clone = function(){

                function _clone_object(object){

                    var new_obj = {}; // New Object

                    for(var key in object){ // Get all Key -> Value Pairs

                        var value = object[key];

                        if(typeof value === 'object'){ // If Object -> Clone Again
                            value = _clone_object(value);
                        }

                        new_obj[key] = value; // Asign new Value ( Without reference )

                    }

                    return new_obj;

                }

                return _clone_object(this.object);

            };


            self.construct(object , local_key);


        },

        /**
         * Class
         * Eine ArrayManager um JavaScript Arrays besser managen zu koennen
         * @param array array - Ein Array das verwaltet werden soll oder null (Dann wird ein leeres Array erzeugt)
         * @constructor
         */
        ArrayManager : function( array , local_key ){

            var self = this;

            /**
             * Konstruktor
             * @param array Array - Das zu verwaltende Array
             * @param local_key string - Der local storage key
             */
            self.construct = function(array , local_key){

                // Das zu verwaltende Objekt
                self.array = typeof array === 'undefined' ? [] : array;

                // Lokales Speichermanagement Key
                local_key = typeof local_key === 'undefined' ? null : local_key;
                if(local_key !== null)
                    self.localStorageManager = new jst.classes.LocalStorageManager(local_key);
                else
                    self.localStorageManager = null;

            };

            /**
             * Fuegt einen Wert zum Array hinzu
             */
            self.add = function(value){

                self.array.push(value);

            };

            /**
             * Entfernt einen Wert aus dem Array
             */
            self.remove = function(index){

                self.array.splice(index,1);

            };

            /**
             * Gibt den Index eines Wertes aus. Wenn nicht vorhanden dann null
             * @param value number - Index of Value or Null
             */
            self.get_index = function(value){

                for(var index in self.array){

                    if(self.array[index] == value) return index;

                }

                return null;

            };

            /**
             * Gibt die Laenge des Arrays zurueck
             * Gleiche Rueckgabe wie array.length
             */
            self.count = function(){

                return self.array.length;

            };

            /**
             * Prueft ob ein Wert im Array vorhanden ist
             * @para value mixed - Der Wert der gesucht werden soll
             */
            self.value_exists = function(value){

                return self.array.indexOf(value) > -1;

            };

            /**
             * Setzt den Key Namen fuer die lokale Speicherung
             * @param key string - der Key Name
             */
            self.set_localstorage_key = function(key_name){

                if(typeof key_name !== 'string') console.error('The key name musst be a string!');
                else self.localStorageManager.storage_key = key_name;

            };

            /**
             * Speichert das Array im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                if(local_key === null) {
                    console.warn('[JST] ArrayManager - Cant save object. No local_key defined in Constructor (Argument 2)');
                    return false;
                }
                else self.localStorageManager.set_objekt( { 'array' : self.array } );

            };

            /**
             * Laedt ein Array aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

                if(local_key === null){

                    console.warn('[JST] ArrayManager - Cant load object. No local_key defined in Constructor (Argument 2)');
                    return false;

                } else {

                    var localStorageArray = self.localStorageManager.get_objekt_key('array');

                    if (localStorageArray !== null) { // Lokale Daten vorhanden ?

                        if (self.count() > 0) { // Standardwerte Vorhanden ? -> Merge Arrays

                            for (var i in localStorageArray) {

                                if (!self.value_exists(localStorageArray[i])) { // Lade vorhandene Werte aus dem Storage

                                    self.add(localStorageArray[i]);

                                }

                            }

                        } else {

                            self.array = localStorageArray;

                        }

                    }

                }

            };

            /**
             * Vergleicht zwei mit einem andere Array ob die gleichen Werte vorhanden sind (Reihenfolge wird nicht beachtet)
             * @param other_array array - Das zu vergleichende Array
             * @return {boolean}
             */
            self.compare_values = function(other_array){

                var same = true;

                for(var i in other_array){
                    var value = other_array[i];
                    if(self.array.indexOf(value) === -1) same = false;
                }

                for(var i in self.array){
                    var value = self.array[i];
                    if(other_array.indexOf(value) === -1) same = false;
                }

                return same;

            };

            /**
             * Sammelt alle Duplikate mit den Index IDs der vorkommen aber loescht diese nicht
             */
            self.get_duplicated_values = function(){

                var duplicated_values = {};

                for(var index = 0; index < this.array.length ; index++){

                    if(this.array.indexOf(this.array[index] , Number(index)+1 ) > -1)
                        if(typeof duplicated_values[this.array[index]] === 'undefined')
                            duplicated_values[this.array[index]] = { duplicated_ids : [ index ] }
                        else {
                            duplicated_values[this.array[index]].duplicated_ids.push(index);
                        }
                }

                return duplicated_values;

            };

            /**
             * Entfernt alle Duplikate im Array
             */
            self.remove_duplicated_values = function(){

                for(var index = 0; index < this.array.length ; index++){

                    if(this.array.indexOf(this.array[index] , Number(index)+1 ) > -1){
                        this.array.splice(index,1);
                        index--;
                    }

                }

            };

            self.construct(array,local_key);

        }


    }

};