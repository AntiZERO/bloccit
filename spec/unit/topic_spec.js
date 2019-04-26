const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "The History of Man",
        description: "A compilation historical facts regarding mankind."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Mankind sets foot on another world",
          body: "In July of 1969, Neil Armstrong became the first human being to stand on the surface of another celestial body.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {

    it("should create a topic object with a title and description", (done) => {
      Topic.create({
        title: "The Matrix",
        description: "One of the best movies of the 20th century",
      })
      .then((topic) => {
        expect(topic.title).toBe("The Matrix");
        expect(topic.description).toBe("One of the best movies of the 20th century");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a topic with missing title or description", (done) => {
      Topic.create({
        title: "The Matrix"
      })
      .then((topic) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Topic.description cannot be null");
        done();
      })
    });
  });

  describe("#getPosts()", () => {

    it("should return an array of posts associated with a given topic", (done) => {
      Post.create({
        title:"Mankind harnesses the power of the atom",
        body: "The first atomic bomb was successfully detonated on July 16th, 1945, Trinity Test in New Mexico as part of the Manhatten Project",
        topicId: this.topic.id
      })
      .then((post) => {
        this.topic.getPosts()
        .then((postArray) => {
          let postCheck = false;
          for (i=0; i < postArray.length; i++) {
            if (postArray[i].title === "Mankind harnesses the power of the atom") {
              postCheck = true;
              break;
            }
          }
          expect(postCheck).toBe(true);
          done();
        })
      })
    })
  });

});