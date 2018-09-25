var jst = {

  exceptions : { // Namespace : exceptions

        JSException : function(message,code,callback){

            message = typeof message === 'undefined' ? 'No errortext set' : message;
            code = typeof code === 'undefined' ? 1 : code;
            callback = typeof callback !== 'function' ? function(){} : callback;

            this.message = message;
            this.code = code;
            this.callback = callback;

            callback(this);

        }


    },

    tools : { // Namespace : tools

        /**
         * Class
         * Eine LocalStorage Manager um JavaScript LocalStorage besser managen zu koennen
         * @constructor
         */
        LocalStorageManager : function(){

            var self = this;

            self.default_object = {}; // Standard Objekt

            /**
             * Holt ein Objekt aus dem LocalStorage
             * @param storage_key string - LocalStorage Key Name
             */
            self.get_local_storage_objekt = function(storage_key){

                if(localStorage.getItem(storage_key) !== null){

                    var objekt = null;

                    try {

                        objekt = JSON.parse(localStorage.getItem(storage_key));

                    } catch(e){}

                    return objekt;

                }

            };

            /**
             * Holt ein Wert anhand des Keys aus einem LocalStorage Objekt
             * @param storage_key string - LocalStorage Key Name
             * @param object_key string - Key Name im LocalStorage Objekt
             */
            self.get_local_storage_objekt_key = function(storage_key , object_key){

                if(localStorage.getItem(storage_key) !== null){

                    var objekt = self.get_local_storage_objekt(storage_key);
                    if(objekt !== null && typeof objekt[object_key] !== 'undefined') return objekt[object_key];
                    else return null;

                }

            };

            /**
             *  Setzte einen Objekt zum LocalStorage key
             * @param key string - LocalStorage Key Name
             * @param object object - Ein Objekt das lokal gespeichert werden soll
             */
            self.set_local_storage_objekt = function (key, object){

                if(typeof object !== 'object') console.error("Objekt erwartet!");
                else localStorage.setItem(key, JSON.stringify(object) );

            };

            /**
             *  Setzte einen Objekt anhand eines Keys im LocalStorage Objekt
             * @param storage_key string - LocalStorage -> Key Name
             * @param object_key string - LocalStorage -> Objekt -> Key Name
             * @pram value mixed - Der Wert der gespeichert werden soll
             */
            self.set_local_storage_objekt_key = function(storage_key, object_key, value){

                if(localStorage.getItem(storage_key) !== null){

                    var objekt = JSON.parse(localStorage.getItem(storage_key));
                    objekt[object_key] = value;
                    self.set_local_storage_objekt(storage_key,objekt);

                } else {

                    var objekt = self.default_object;
                    objekt[object_key] = value;
                    self.set_local_storage_objekt(storage_key,objekt);

                }

            };

            /**
             * Loescht einen Keys aus dem LocalStorage
             * @param storage_key string - LocalStorage Key Name
             */
            self.delete_local_storage_key = function(storage_key){

                localStorage.removeItem(storage_key);

            }

            /**
             * Setzt den Inhalt eines Keys im LocalStorage auf NULL
             * @param storage_key string - LocalStorage Key Name
             */
            self.clear_local_storage_key = function(storage_key){

                if(self.get_local_storage_objekt(storage_key) !== null)
                    localStorage.setItem(storage_key, null);

            }



        },

        /**
         * Class
         * Eine ObjektManager um JavaScript Objekte besser managen zu koennen
         * @param object object - Ein Objekt das verwaltet werden soll oder null (Dann wird ein leeres Objekt erzeugt)
         * @constructor
         */
        ObjectManager : function(object){

            var self = this;

            // Das zu verwaltende Objekt
            self.object = typeof object === 'undefined' ? {} : object;

            // Lokales Speichermanagement
            self.localStorageKey = null;
            self.localStorageManager = new CLASSES.tools.LocalStorageManager();

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
                else self.localStorageKey = key_name;

            };

            /**
             * Speichert das Objekt im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                if(typeof self.localStorageKey !== 'string') console.error('[class_ObjectManager].save() : LocalStorage Key nicht gesetzt!');
                else self.localStorageManager.set_local_storage_objekt(self.localStorageKey , self.object);

            };

            /**
             * Laedt ein Objekt aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

                if(typeof self.localStorageKey !== 'string') console.error('[class_ObjectManager].load() : LocalStorage Key nicht vorhanden!');
                else {

                    var localStorageObject = self.localStorageManager.get_local_storage_objekt(self.localStorageKey);

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

                if(typeof self.localStorageKey === 'undefined') return false;

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

        },

        /**
         * Class
         * Eine ArrayManager um JavaScript Arrays besser managen zu koennen
         * @param array array - Ein Array das verwaltet werden soll oder null (Dann wird ein leeres Array erzeugt)
         * @constructor
         */
        ArrayManager : function(array , value_types){

            var self = this;

            // Lokales Speichermanagement
            self.localStorageKey = null;
            self.localStorageManager = new CLASSES.tools.LocalStorageManager();

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
                else self.localStorageKey = key_name;

            };

            /**
             * Speichert das Array im localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.save = function(){

                if(typeof self.localStorageKey !== 'string') console.error('[class_ArrayManager].save() : LocalStorage Key nicht gesetzt!');
                else self.localStorageManager.set_local_storage_objekt(self.localStorageKey , { 'array' : self.array } );

            };

            /**
             * Laedt ein Array aus dem localStorage
             * Hierbei muss in der Instanz das Attribut "localStorageKey" gesetzt werden
             * damit die Funktion weiss mit welchem Speicherplatz lokal gearbeitet werden soll
             */
            self.load = function(){

                if(typeof self.localStorageKey !== 'string') console.error('[class_ArrayManager].load() : LocalStorage Key nicht vorhanden!');
                else {

                    var localStorageArray = self.localStorageManager.get_local_storage_objekt_key(self.localStorageKey, 'array');

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



        },

    }



};
