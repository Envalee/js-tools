var jst = {

    type : { // JS Tool Types

        main : { // Namespace : datatype / Datentypen fest definieren

            Integer : function(number){
                if(isNaN(parseInt(number)))
                    throw new jst.type.exceptions.JSException('[Integer] Ungueltiger Parameter im Konstruktor!');
                this.value = parseInt(number);
            },

            Float : function(number){
                if(typeof number === 'string') number = number.replace(',','.');
                if(isNaN(parseFloat(number)))
                    throw new jst.type.exceptions.JSException('[Float] Ungueltiger Parameter im Konstruktor! Zahl kann nicht konvertiert werden!');
                this.value = parseFloat(number);
            },

            String : function(string){
                this.value = string.toString();
            },

            Boolean : function(boolean){
                if(boolean) this.value = true;
                else this.value = false;
            },

            Object : function(object){

                if(typeof object === 'object' && object.length === 'undefined'){
                    this.value = object;
                } else {
                    throw new jst.type.exceptions.JSException('[Object] Ungueltiger Parameter beim Konstruktor! Es wird ein Objekt erwartet!');
                }

            },

            Array : function(array){

                if(typeof array === 'object' && array.length !== 'undefined'){
                    this.value = array;
                } else {
                    throw new jst.type.exceptions.JSException('[Array] Ungueltiger Parameter beim Konstruktor! Es wird ein Array erwartet!');
                }

            }


        },

        math : { // Namespace : math / Mathematische Strukturen

            Range : function(from,to){ // Von-Bis Angabe
                this.from = new jst.type.main.Float(from).value;
                this.to = new jst.type.main.Float(to).value;
            },

            Vector2D : function(x,y){ // 2D Koordinate
                this.x = x;
                this.y = y;
            }

        },

        exceptions : { // Namespace : exceptions

            JSException : function(message,code,data){

                this.message = typeof message === 'undefined' ? 'No errortext set' : message;
                this.code = typeof code === 'undefined' ? 0 : code;
                this.data = typeof data !== 'object' ? {} : data;

            }

        },

        names : { // REFERENZ

            get integer()   {   return jst.type.main.Integer  },
            get int()       {   return jst.type.main.Integer  },
            get float()     {   return jst.type.main.Float    },
            get boolean()   {   return jst.type.main.Boolean  },
            get bool()      {   return jst.type.main.Boolean  },
            get bit()       {   return jst.type.main.Boolean  },
            get string()    {   return jst.type.main.String   },
            get object()    {   return jst.type.main.Object   },
            get array()     {   return jst.type.main.Array    },

            get range()     {   return jst.type.math.Range        },
            get vector2d()  {   return jst.type.math.Vector2D     }

        }

    },

    static : { // Static JS Tool Classes ( No instance needed )

        /**
         * Class
         * Formatiert diverse diverse Formate
         */
        Formater : new function(){

            var self = this;

            self.to_number = function(number_string){

                return Number(number_string.toString()
                    .replace(',','.')
                    .replace(/[^0-9][\\.]/g,'')
                );

            },


            /**
             * Fuellt eine Mitgegebene Nummer soweit mit Nullen davor auf, dass sie eine einheitliche Laenge bekommt.
             * @param number int - Die Nummer selbst
             * @param number_length int - Aus wievielen Zahlen die Nummer bestehen soll ( Laenge des Zahlenstrings )
             * @returns string - Die Zahl mit Nullen aufgefuellt falls es notwendig war
             */
            self.zerofill = function(number,number_length){

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
             * @returns string - Datetime
             */
            self.get_datetimestring = function(dateobject,iso_format){

                if (typeof dateobject === 'undefined') dateobject = new Date();

                return this.get_datestring(dateobject,iso_format) + " " + this.get_timestring(dateobject);

            };

            /**
             * Gibt einen einheitlichen String mit Datum zurueck
             * @param dateobject Date - Optional - Standard: Aktuelle Zeit - Datums Objekt von JavaScript
             * @param reverse_string boolean - Optional - Soll das Datum im US Format ausgegeben werden
             * @returns string Date
             */
            self.get_datestring = function(dateobject , iso_format){

                if (typeof dateobject === 'undefined') dateobject = new Date();
                if (typeof iso_format === 'undefined') iso_format = false;

                if(iso_format){

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

                if (typeof dateobject === 'undefined') dateobject = new Date();
                if (typeof display_seconds === 'undefined') display_seconds = true;

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
         * Datentyp Checker
         */
        TypeChecker : new function(){

            var self = this;

            /**
             * Checkt ob ein Wert einen bestimmten Datentyp entspricht (Klasse).
             * @param value mixed - Der Wert oder die Variable die geprueft werden soll
             * @param typename string - Der Datetyp den der Wert entsprechen soll
             * @oaram show_console_error boolean - Soll ein Fehler in der Konsole ausgegeben werden wenn der Typ nicht stimmt
             */
            self.check = function(value,typename,show_console_error){

                typename = typename.toLowerCase();

                if(typeof jst.type.names[typename] === 'undefined'){
                    console.error("[TypeChecker] Undefinierte Typreferenz: " + typename);
                    return false;
                }

                if(value instanceof jst.type.names[typename]) {

                    return true;
                } else {

                    if(show_console_error) console.error("[TypeChecker] Erwartet Struktur: " + typename);
                    return false;
                }

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
            self.prozent = function(float,range){

                if(!jst.static.TypeChecker.check(float, 'float',true)) return false;
                if(!jst.static.TypeChecker.check(range, 'range',true)) return false;

                return (float.value-range.from)/(range.to-range.from)*100;

            };


        }

    },

    classes : { // JS Tool Classes

        /**
         * Class
         * Eine LocalStorage Manager um JavaScript LocalStorage besser managen zu koennen
         * @constructor
         */
        LocalStorageManager : function(storage_key){

            var self = this;

            self.storage_key = storage_key;

            self.default_object = {}; // Standard Objekt

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

                if(typeof object !== 'object') console.error("Objekt erwartet!");
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


        },

        /**
         * Class
         * Eine ObjektManager um JavaScript Objekte besser managen zu koennen
         * @param object object - (Optional) Ein Objekt das verwaltet werden soll oder null (Dann wird ein leeres Objekt erzeugt)
         * @param local_key string - (Optional) Local Storage Key
         * @constructor
         */
        ObjectManager : function(object , local_key){

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
                self.object = this.clone();

                // Lokales Speichermanagement Key
                local_key = typeof local_key === 'undefined' ? 'jst-local-key-placeholder' : local_key;
                // Lokales Speichermanagement
                self.localStorageManager = new jst.classes.LocalStorageManager(local_key);


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

                if(typeof key_name !== 'string') console.error('Der Key Name muss vom Typ string sein!');
                else self.localStorageManager.storage_key = key_name;

            };

            /**
             * Speichert das Objekt im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                self.localStorageManager.set_objekt( self.object );

            };

            /**
             * Laedt ein Objekt aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

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

                if(typeof self.object[key] !== 'undefined') return true;
                else return false;

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

            }

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

            }


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

            }


            self.construct(object , local_key);


        },

        /**
         * Class
         * Eine ArrayManager um JavaScript Arrays besser managen zu koennen
         * @param array array - Ein Array das verwaltet werden soll oder null (Dann wird ein leeres Array erzeugt)
         * @constructor
         */
        ArrayManager : function(array , local_key){

            var self = this;

            // Lokales Speichermanagement Key
            local_key = typeof local_key === 'undefined' ? 'jst-local-key-placeholder' : local_key;
            self.localStorageManager = new jst.classes.LocalStorageManager(local_key);

            // Das zu verwaltende Objekt
            self.array = typeof array === 'undefined' ? [] : array;

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

              if(self.array.indexOf(value) > -1) return true;
              else return false;

            };

            /**
             * Setzt den Key Namen fuer die lokale Speicherung
             * @param key string - der Key Name
             */
            self.set_localstorage_key = function(key_name){

                if(typeof key_name !== 'string') console.error('Der Key Name muss vom Typ string sein!');
                else self.localStorageManager.storage_key = key_name;

            };

            /**
             * Speichert das Array im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                self.localStorageManager.set_objekt( { 'array' : self.array } );

            };

            /**
             * Laedt ein Array aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

                if(typeof self.localStorageManager.storage_key !== 'string') console.error('[JST-ArrayManager].load() : LocalStorage Key nicht vorhanden!');
                else {

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



        }



    }



};



