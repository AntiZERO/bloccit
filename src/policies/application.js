module.exports = class ApplicationPolicy {

  // the contructor initializes the policy instance with the currently authenticated
  // user and objects we are trying to authorize.
   constructor(user, record) {
     this.user = user;
     this.record = record;
   }
 
  // `_isOwner` is a helper method and that checks that a record is present and the user owns it.
   _isOwner() {
     return this.record && (this.record.userId == this.user.id);
   }
 
  // `_isAdmin` is a helper method that checks that a user is present and that the user is an admin user.
   _isAdmin() {
     return this.user && this.user.role == "admin";
   }

   _isMember() {
     return this.user && this.user.role == "member";
   }
 
  // `new` checks that a user is present. `create` delegates to `new`. `show` always authorizes the action.
   new() {
     return !!this.user;
   }
 
   create() {
     return this.new();
   }
 
   show() {
     return true;
   }
 
  // `edit` checks that the user is allowed to create a new record, a record is present, and either
  // the user owns the record, or the user is an admin.
   edit() {
     return this.new() &&
       this.record && (this._isOwner() || this._isAdmin());
   }
 
   update() {
     return this.edit();
   }
 
  // `destroy` delegates to `update`
   destroy() {
     return this.update();
   }
 }