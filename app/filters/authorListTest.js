describe('authorList filter', function() {

  beforeEach(module('photo-gallery.authorList'));

  describe('authorList', function() {

    it('should produce a string with the author\'s usernames', inject(function(authorListFilter) {
      expect(authorListFilter([
        { username: 'Toto' },
        { username: 'Titi' },
        { username: 'Tata' },
        { username: 'Tutu' },
      ])).toBe('Toto, Titi, Tata, Tutu');
    }));

    it('should produce a string with the only author\'s username', inject(function(authorListFilter) {
      expect(authorListFilter([
        { username: 'Toto' }
      ])).toBe('Toto');
    }));
  });
});
