// Generated by CoffeeScript 1.3.3
(function() {

  require(['jquery', 'd3', 'underscore'], function($, d3, _) {
    var addAxes, addAxesAnnotations, axis, c, chords, circleTweetCount, countDown, countries_g, explode, force, forceGraph, geoTweet, links_g, listUsers, nextSlide, philSlide, removeAxes, scaleTweetCount, scatterPlot, slide, slide2, stats, svg, users;
    c = {
      width: $(document).width() * 0.98,
      height: $(document).height() * 0.97,
      transitionLength: 2000
    };
    svg = d3.select('body').append('svg').attr('width', c.width).attr('height', c.height);
    svg.append("svg:defs").append("svg:marker").attr("id", 'special').attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 12).attr("orient", "auto").append("svg:path").attr("d", "M 0,-5 L 10,0 L0,5");
    svg.append("svg:defs").append("svg:marker").attr("id", 'special-start').attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 12).attr("orient", "auto").append("svg:path").attr("d", "M 10,-5 L 0,0 L10,5");
    links_g = svg.append('svg:g').attr('class', 'links');
    countries_g = svg.append('svg:g').attr('class', 'countries');
    users = svg.selectAll('g.user').data([], function(d) {
      return d.user_id;
    });
    users = null;
    stats = {};
    nextSlide = null;
    listUsers = function() {
      var clip, columnSpacing, padding, perColumn, spacing;
      perColumn = 10;
      padding = 40;
      spacing = (c.height - padding * 2) / perColumn;
      columnSpacing = (c.width - padding * 2) / 5;
      users.append('circle').attr('class', 'user').attr('r', 24).attr('cy', function(d, i) {
        return padding + (i % perColumn) * spacing;
      }).attr('cx', -100).style('stroke', '#FF6600').style('stroke-width', 2).transition().duration(100).delay(function(d, i) {
        return i * 100 - 50;
      }).attr('cx', function(d, i) {
        var colN;
        colN = Math.floor(i / perColumn);
        return padding + colN * columnSpacing;
      });
      clip = svg.append('clipPath').attr('id', 'clipcircle').attr('clipPathUnits', 'objectBoundingBox').append('circle').attr('r', 0.5).attr('cx', 0.5).attr('cy', 0.5);
      users.append('image').attr('class', 'user').attr('xlink:href', function(d) {
        return d.avatar;
      }).attr('clipPath', function(d) {
        return d.avatar;
      }).attr('width', 48).attr('height', 48).attr('y', function(d, i) {
        return padding + (i % perColumn) * spacing - 24;
      }).attr('x', -100).style('fill', '#FF6600').style('clip-path', 'url(#clipcircle)').transition().duration(100).delay(function(d, i) {
        return i * 100 - 50;
      }).attr('x', function(d, i) {
        var colN;
        colN = Math.floor(i / perColumn);
        return padding + colN * columnSpacing - 24;
      });
      return users.append('text').attr('class', 'user').text(function(d) {
        return d.screen_name;
      }).attr('y', function(d, i) {
        return padding + (i % perColumn) * spacing;
      }).attr('x', c.width + 500).style('fill', function(d) {
        return d.color;
      }).style('dominant-baseline', 'middle').transition().duration(100).delay(function(d, i) {
        return i * 100 - 50;
      }).attr('x', function(d, i) {
        var colN;
        colN = Math.floor(i / perColumn);
        return padding + colN * columnSpacing + 35;
      });
    };
    force = null;
    forceGraph = function() {
      return d3.json('twitterdata/links.json', function(links) {
        var find, link, linksToNodes, node, nodeC, nodesToNodes, nodetext, szscale, thickness;
        force = d3.layout.force().charge(-100).linkDistance(400).size([c.width, c.height]).gravity(0.05);
        find = function(coll, test) {
          var i, _i, _ref;
          for (i = _i = 0, _ref = coll.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (test(coll[i])) {
              return i;
            }
          }
          return -1;
        };
        links = links.map(function(link) {
          link.source = find(users.data(), function(u) {
            return u.id === link.source;
          });
          link.target = find(users.data(), function(u) {
            return u.id === link.target;
          });
          link.weight = link.value;
          return link;
        });
        force.nodes(users.data()).links(links).linkStrength(function(d) {
          var strength;
          return strength = d.value / d3.max(links, function(d) {
            return d.value;
          });
        }).start();
        thickness = d3.scale.linear().range([1, 5]).domain([
          0, d3.max(links, function(d) {
            return d.value;
          })
        ]);
        linksToNodes = {};
        nodesToNodes = {};
        link = links_g.selectAll('line.link').data(links).enter().append('line').attr('class', 'link').attr('stroke-width', function(d) {
          return thickness(d.value);
        }).attr('stroke', '#ccc').each(function(l) {
          var _name, _name1, _name2, _name3;
          linksToNodes[_name = l.source.id] || (linksToNodes[_name] = []);
          linksToNodes[l.source.id].push(this);
          linksToNodes[_name1 = l.target.id] || (linksToNodes[_name1] = []);
          linksToNodes[l.target.id].push(this);
          nodesToNodes[_name2 = l.source.id] || (nodesToNodes[_name2] = [l.source.id]);
          nodesToNodes[l.source.id].push(l.target.id);
          nodesToNodes[_name3 = l.target.id] || (nodesToNodes[_name3] = [l.target.id]);
          return nodesToNodes[l.target.id].push(l.source.id);
        });
        szscale = d3.scale.log().domain([1, 30]).range([32, 64]);
        node = svg.selectAll('image.user').attr('width', function(d) {
          return szscale(d.weight || 1);
        }).attr('height', function(d) {
          return szscale(d.weight || 1);
        });
        node.on('mouseover', function(d) {
          var ls, ns;
          if (ls = linksToNodes[d.id]) {
            ls.forEach(function(link) {
              return d3.select(link).style('stroke', '#66FF00');
            });
          }
          if (ns = nodesToNodes[d.id]) {
            return ns.forEach(function(n) {
              return svg.select("circle.user-" + n).style('stroke-width', 5).style('stroke', '#66FF00');
            });
          }
        });
        node.on('mouseout', function(d) {
          var ls, ns;
          if (ls = linksToNodes[d.id]) {
            ls.forEach(function(link) {
              return d3.select(link).style('stroke', '');
            });
          }
          if (ns = nodesToNodes[d.id]) {
            return ns.forEach(function(n) {
              return svg.select("circle.user-" + n).style('stroke-width', '').style('stroke', '');
            });
          }
        });
        nodeC = svg.selectAll('circle.user').attr('r', function(d) {
          return szscale(d.weight || 1) / 2;
        }).attr('class', function(d) {
          return "user user-" + d.id;
        });
        nodetext = svg.selectAll('text.user').attr('class', 'nodetext').text(function(d) {
          return d.screen_name;
        });
        return force.on('tick', function() {
          node.attr('x', function(d) {
            return d.x - szscale(d.weight || 1) / 2;
          }).attr('y', function(d) {
            return d.y - szscale(d.weight || 1) / 2;
          });
          nodeC.attr('cx', function(d) {
            return d.x;
          }).attr('cy', function(d) {
            return d.y;
          });
          nodetext.attr('x', function(d) {
            return d.x + 30;
          }).attr('y', function(d) {
            return d.y;
          });
          return link.attr('x1', function(d) {
            return d.source.x;
          }).attr('y1', function(d) {
            return d.source.y;
          }).attr('x2', function(d) {
            return d.target.x;
          }).attr('y2', function(d) {
            return d.target.y;
          });
        });
      });
    };
    chords = function() {
      var chordRadius, chordRadius2, isize, ul, xmath, xmath2, ymath, ymath2;
      force.stop();
      chordRadius = 250;
      chordRadius2 = 280;
      ul = users[0].length;
      xmath = function(d, i) {
        return c.width / 2 + chordRadius * Math.cos((i / ul) * 2 * Math.PI);
      };
      ymath = function(d, i) {
        return c.height / 2 + chordRadius * Math.sin((i / ul) * 2 * Math.PI);
      };
      xmath2 = function(d, i) {
        return c.width / 2 + chordRadius2 * Math.cos((i / ul) * 2 * Math.PI);
      };
      ymath2 = function(d, i) {
        return c.height / 2 + chordRadius2 * Math.sin((i / ul) * 2 * Math.PI);
      };
      isize = 32;
      users.select('image').transition().duration(c.transitionLength).attr('width', isize).attr('height', isize).attr('x', function(d, i) {
        return xmath(d, i) - isize / 2;
      }).attr('y', function(d, i) {
        return ymath(d, i) - isize / 2;
      });
      users.select('circle').transition().duration(c.transitionLength).attr('r', isize / 2).attr('cx', xmath).attr('cy', ymath);
      users.select('text').transition().duration(c.transitionLength).attr('x', xmath2).attr('y', ymath2).style('text-anchor', function(d, i) {
        if (xmath2(d, i) < c.width / 2) {
          return 'end';
        } else {
          return 'start';
        }
      }).attr('transform', function(d, i) {
        var deg, x, y;
        deg = (i / ul) * 360;
        x = xmath2(d, i);
        y = ymath2(d, i);
        if (xmath2(d, i) < c.width / 2) {
          deg = deg - 180;
        }
        return "rotate(" + deg + "," + x + "," + y + ")";
      });
      return svg.selectAll('line.link').transition().duration(c.transitionLength).attr('x1', function(d) {
        return xmath(d, d.source.index);
      }).attr('x2', function(d) {
        return xmath(d, d.target.index);
      }).attr('y1', function(d) {
        return ymath(d, d.source.index);
      }).attr('y2', function(d) {
        return ymath(d, d.target.index);
      });
    };
    countDown = function() {
      var arc, l, num, pie, s;
      s = svg.append('svg:g').attr('class', 'slide');
      arc = function(start, end) {
        start = (start / 180) * Math.PI;
        end = (end / 180) * Math.PI;
        return d3.svg.arc().innerRadius(0).outerRadius(1000).startAngle(start).endAngle(end)();
      };
      pie = s.append('path').attr('d', arc(0, 0)).attr('fill', '#787878').attr('transform', "translate(" + (c.width / 2) + "," + (c.height / 2) + ")");
      s.append('circle').attr('cx', c.width / 2).attr('cy', c.height / 2).attr('r', 200).style('stroke', 'rgba(255,255,255,0.8)').style('stroke-width', 5);
      s.append('circle').attr('cx', c.width / 2).attr('cy', c.height / 2).attr('r', 230).style('stroke', 'rgba(255,255,255,0.5)').style('stroke-width', 5);
      s.append('line').attr('x1', 0).attr('x2', c.width).attr('y1', c.height / 2).attr('y2', c.height / 2).attr('stroke', '#000').attr('stroke-width', 5);
      s.append('line').attr('x1', c.width / 2).attr('x2', c.width / 2).attr('y1', 0).attr('y2', c.height).attr('stroke', '#000').attr('stroke-width', 5);
      num = s.append('text').text('5').style('fill', '#000').style('font-size', 300).style('text-anchor', 'middle').style('dominant-baseline', 'central').attr('x', c.width / 2).attr('y', c.height / 2);
      l = 1000;
      return d3.timer(function(n) {
        var count, deg, updown;
        deg = (n / l) * 360;
        count = Math.floor(n / l);
        if (count % 2 === 0) {
          updown = 'up';
        } else {
          updown = 'down';
        }
        if (count >= 5) {
          s.transition().duration(1000).attr('transform', 'translate(-5000,0)').each('end', function() {
            d3.selectAll('g.slide').remove();
            return nextSlide();
          });
          return true;
        } else {
          num.text(5 - count);
          if (updown === 'up') {
            pie.attr('d', arc(0, deg % 360));
          } else {
            pie.attr('d', arc(deg % 360, 359));
          }
          return false;
        }
      });
    };
    axis = svg.append('svg:g').attr('class', 'axis');
    circleTweetCount = function() {
      var r;
      force.stop();
      svg.selectAll('line.link').remove();
      r = d3.scale.log().domain(stats.statuses_count).range([0, c.height * 0.75]);
      axis.append('line').attr('class', 'xaxis').attr('x1', c.width / 2 + 0.5).attr('y1', c.height * 0.75).attr('x2', c.width / 2 + 0.5).attr('y2', c.height * 0.75).transition().duration(c.transitionLength).attr('x2', c.width - 150).attr('y2', 150).attr('marker-start', 'url(#special-start)').attr('marker-end', 'url(#special)');
      axis.append('text').text('Loads a tweets').style('text-anchor', '').attr('x', c.width / 2).attr('y', c.height * 0.75).attr('transform', function() {
        var deg;
        deg = -2 * Math.tan(c.height / c.width) * (90 / Math.PI);
        return "rotate(" + deg + "," + (c.width / 2) + "," + (c.height * 0.75) + ")";
      }).transition().duration(c.transitionLength).attr('x', c.width - 120).attr('y', 145).attr('transform', function() {
        var deg;
        deg = -2 * Math.tan(c.height / c.width) * (90 / Math.PI);
        return "rotate(" + deg + "," + (c.width - 145) + "," + 120 + ")";
      });
      users.select('image').style('opacity', 0);
      users.select('circle').transition().duration(c.transitionLength).style('fill', 'none').attr('r', function(d) {
        return r(d.statuses_count);
      }).attr('cx', c.width / 2).attr('cy', c.height * 0.75);
      return users.select('text').transition().duration(c.transitionLength).text(function(d) {
        return d.screen_name;
      }).style('text-anchor', 'middle').attr('x', c.width / 2).attr('y', function(d) {
        return (c.height * 0.75) - r(d.statuses_count);
      }).attr('transform', function(d, i) {
        var cx, cy;
        d = ((i * 5) % 90) - 45;
        cx = c.width / 2;
        cy = c.height * 0.75;
        return "rotate(" + d + "," + cx + "," + cy + ")";
      });
    };
    scaleTweetCount = function() {
      var y, _y;
      _y = d3.scale.log().domain(stats.statuses_count).range([40, c.height - 40]);
      y = function(d, i) {
        return c.height - _y(d, i);
      };
      users.select('image').transition().duration(c.transitionLength).style('opacity', 1).attr('y', function(d) {
        return y(d.statuses_count) - 24;
      }).attr('x', c.width / 2 - 24 + 50);
      users.select('circle').transition().duration(c.transitionLength).style('opacity', 0).attr('r', 24).attr('cy', function(d) {
        return y(d.statuses_count);
      });
      users.select('text').transition().duration(c.transitionLength).attr('x', (c.width / 2) + 80).attr('y', function(d) {
        return y(d.statuses_count);
      }).style('text-anchor', 'start').attr('transform', function(d) {
        return "rotate(0)";
      });
      axis.select('line.xaxis').transition().duration(c.transitionLength).attr('x1', c.width / 2 + 0.5).attr('x2', c.width / 2 + 0.5).attr('y2', 35).attr('y1', c.height - 45);
      return axis.select('text').transition().duration(c.transitionLength).attr('y', 20).attr('x', c.width / 2).attr('transform', '').style('text-anchor', 'middle');
    };
    addAxes = function() {
      var x, y, _y;
      _y = d3.scale.linear().domain(stats.statuses_count).range([0, c.height]);
      y = function(d, i) {
        return c.height - _y(d, i);
      };
      x = d3.time.scale().domain(stats.signed_up).range([0, c.width]);
      axis.append('text').text('Joined recently').style('text-anchor', 'end').attr('x', c.width - 20).attr('y', c.height / 2 - 10);
      axis.append('text').text('Joined ages ago').style('text-anchor', 'start').attr('x', 20).attr('y', c.height / 2 - 10);
      axis.append('text').text('Nay tweets').style('text-anchor', 'middle').attr('y', c.height - 20).attr('x', c.width / 2);
      axis.append('line').attr('y1', c.height / 2 + 0.5).attr('y2', c.height / 2 + 0.5).attr('x1', 20).attr('x2', c.width - 20).attr('marker-start', 'url(#special-start)').attr('marker-end', 'url(#special)');
      return axis.append('line').attr('x1', c.width / 2 + 0.5).attr('x2', c.width / 2 + 0.5).attr('y1', 35).attr('y2', c.height - 45).attr('marker-start', 'url(#special-start)').attr('marker-end', 'url(#special)');
    };
    addAxesAnnotations = function() {
      var maxis, note;
      maxis = svg.append('svg:g').attr('class', 'axisan');
      note = function(text, xp, yp, delay, duration) {
        var r, t;
        r = maxis.append('rect').style('fill', '#66FF00');
        t = maxis.append('text').text(text);
        t.attr('x', c.width * xp).attr('y', c.height * yp).style('text-anchor', 'middle').style('opacity', 0).transition().duration(duration).delay(delay).style('opacity', 1);
        return r.attr('width', t[0][0].clientWidth + 10).attr('height', t[0][0].clientHeight + 10).attr('x', c.width * xp - (t[0][0].clientWidth + 10) / 2).attr('y', c.height * yp - (t[0][0].clientHeight + 20) / 2).style('opacity', 0).transition().duration(duration).delay(delay).style('opacity', 1);
      };
      note('Old Bores', 0.25, 0.25, 0, 1000);
      note('A bit Keen', 0.75, 0.25, 1000, 1000);
      note('Learning the ropes', 0.75, 0.75, 2000, 1000);
      return note('Stalkers', 0.25, 0.75, 3000, 1000);
    };
    removeAxes = function() {
      svg.selectAll('g.axis').remove();
      return svg.selectAll('g.axisan').remove();
    };
    scatterPlot = function() {
      var x, y, _y;
      addAxes();
      _y = d3.scale.log().domain(stats.statuses_count).range([20, c.height - 20]);
      y = function(d, i) {
        return c.height - _y(d, i);
      };
      x = d3.time.scale().domain(stats.signed_up).range([20, c.width - 20]);
      users.select('image').transition().duration(c.transitionLength).attr('width', 48).attr('height', 48).attr('y', function(d) {
        return y(d.statuses_count) - 24;
      }).attr('x', function(d) {
        return x(d.signed_up) - 24;
      });
      users.select('circle').transition().duration(c.transitionLength).attr('cx', function(d) {
        return x(d.signed_up);
      }).attr('cy', function(d) {
        return y(d.statuses_count);
      });
      return users.select('text').transition().duration(c.transitionLength).attr('x', function(d) {
        return x(d.signed_up) + 30;
      }).attr('y', function(d) {
        return y(d.statuses_count);
      });
    };
    geoTweet = function() {
      var circle, clip, origin, path, projection,
        _this = this;
      removeAxes();
      origin = [-3.22, 55.95];
      projection = d3.geo.azimuthal().scale(100).origin(origin).mode('orthographic').translate([c.width / 2, c.height / 2]);
      path = d3.geo.path().projection(projection).pointRadius(3);
      circle = d3.geo.greatCircle().origin(projection.origin());
      clip = function(d) {
        return path(circle.clip(d));
      };
      return d3.json('world-countries.json', function(collection) {
        var countries, delta, ease, originalOrigin, originalScale, redraw, scaleTimeLength, sease, spin, spinTimeLength, spun, startSpin;
        redraw = function() {
          countries_g.selectAll('path').attr('d', clip);
          users.select('circle').style('opacity', 1).attr('cx', function(d) {
            return projection(d.geocoords)[0];
          }).attr('cy', function(d) {
            return projection(d.geocoords)[1];
          });
          return users.select('text').attr('x', function(d) {
            return projection(d.geocoords)[0];
          }).attr('y', function(d) {
            return projection(d.geocoords)[1];
          }).style('text-anchor', 'start').attr('transform', function(d, i) {
            var angle, p;
            angle = (i * 10) % 360;
            p = projection(d.geocoords);
            return "rotate(" + angle + "," + p[0] + "," + p[1] + ")translate(15,0)";
          });
        };
        spun = 0;
        delta = 40;
        spinTimeLength = 6000;
        scaleTimeLength = 6000;
        originalOrigin = projection.origin();
        originalScale = projection.scale();
        ease = d3.ease('elastic');
        sease = d3.ease('cubic-in');
        spin = function(timestep) {
          var scale;
          spun = 360 * ease(timestep / spinTimeLength);
          scale = originalScale + 20000 * sease(timestep / scaleTimeLength);
          origin = [originalOrigin[0] + spun, originalOrigin[1]];
          projection.origin(origin);
          circle.origin(origin);
          projection.scale(scale);
          redraw();
          if (timestep >= spinTimeLength && timestep >= scaleTimeLength) {
            return true;
          } else {
            return false;
          }
        };
        startSpin = function() {
          return d3.timer(spin);
        };
        countries = countries_g.selectAll('path').data(collection.features).enter().append('svg:path').attr('d', clip);
        users.select('image').transition().duration(200).style('opacity', 0);
        users.select('text').transition().duration(2000).attr('x', function(d) {
          return projection(d.geocoords)[0];
        }).attr('y', function(d) {
          return projection(d.geocoords)[1];
        }).attr('transform', function(d, i) {
          var angle, p;
          angle = (i * 10) % 360;
          p = projection(d.geocoords);
          return "rotate(" + angle + "," + p[0] + "," + p[1] + ")translate(25,0)";
        }).style('font-size', '20px');
        return users.select('circle').transition().duration(2000).style('opacity', 1).attr('r', 3).attr('cx', function(d) {
          return projection(d.geocoords)[0];
        }).attr('cy', function(d) {
          return projection(d.geocoords)[1];
        }).each('end', startSpin);
      });
    };
    slide = function(text) {
      return function() {
        var s;
        s = svg.append('svg:g').attr('class', 'slide');
        s.append('text').text(text).style('text-anchor', 'middle').attr('y', c.height / 2).attr('x', c.width + 500).attr('width', c.width * 0.75).attr('height', c.width * 0.75).transition().duration(c.transitionLength / 2).attr('x', c.width / 2);
        return s;
      };
    };
    slide2 = function(text1, text2) {
      return function() {
        var s;
        s = svg.append('svg:g').attr('class', 'slide');
        s.append('text').text(text1).style('text-anchor', 'middle').attr('y', c.height * 0.4).attr('x', c.width + 500).attr('width', c.width * 0.75).attr('height', c.width * 0.75).transition().duration(c.transitionLength / 2).attr('x', c.width / 2);
        s.append('text').text(text2).style('text-anchor', 'middle').attr('y', c.height * 0.65).attr('x', c.width + 500).attr('width', c.width * 0.75).attr('height', c.width * 0.75).style('font-size', '80px').transition().duration(c.transitionLength / 2).attr('x', c.width / 2);
        return s;
      };
    };
    philSlide = function() {
      slide('@philip_roberts')();
      return svg.select('g.slide').append('text').text('←').attr('x', c.width + 500).attr('y', c.height * 0.8).style('text-anchor', 'middle').style('font-size', 200).style('fill', '#FF6600').transition().duration(5000).delay(500).ease('elastic', 10, 10).attr('x', c.width * 0.2);
    };
    explode = function() {
      svg.selectAll('text').transition().duration(c.transitionLength).attr('x', -500).remove();
      svg.selectAll('path').transition().duration(c.transitionLength).attr('transform', "translate(-50000,0)").remove();
      return svg.selectAll('circle').transition().duration(c.transitionLength).attr('cx', -500).remove();
    };
    return d3.json('twitterdata/users.json', function(coll) {
      var currSlide, nextS, slides;
      coll = coll.map(function(u) {
        u.geocoords = u.coords || [-3.22, 55.95];
        u.signed_up = new Date(Date.parse(u.signed_up));
        return u;
      });
      users = svg.selectAll('g.user').data(coll, function(d) {
        return d.user_id;
      });
      users.enter().append('svg:g').attr('class', 'user');
      stats.statuses_count = d3.extent(coll, function(d) {
        return d.statuses_count;
      });
      stats.signed_up = d3.extent(coll, function(d) {
        return d.signed_up;
      });
      currSlide = 0;
      slides = [];
      nextSlide = function() {
        var s;
        s = svg.selectAll('g.slide');
        if (s[0].length > 0) {
          s.selectAll('text').transition().duration(500).attr('x', -500).remove();
          slides[currSlide]();
        } else {
          slides[currSlide]();
        }
        return currSlide++;
      };
      slides.push(slide("hello"));
      slides.push(philSlide);
      slides.push(slide("d3.js"));
      slides.push(slide("data"));
      slides.push(slide("html/svg"));
      slides.push(slide("it's a bit, wat?"));
      slides.push(slide("and a bit wow"));
      slides.push(slide("concepts:"));
      slides.push(slide("declarative"));
      slides.push(slide("data binding"));
      slides.push(slide("scales/projections"));
      slides.push(slide("good for"));
      slides.push(slide("not for"));
      slides.push(slide("who's using it?"));
      slides.push(slide("demo"));
      slides.push(countDown);
      slides.push(listUsers);
      slides.push(forceGraph);
      slides.push(chords);
      slides.push(circleTweetCount);
      slides.push(scaleTweetCount);
      slides.push(scatterPlot);
      slides.push(addAxesAnnotations);
      slides.push(geoTweet);
      slides.push(explode);
      slides.push(slide("so, like, holy cow!"));
      slides.push(slide2("questions?", "@philip_roberts"));
      nextSlide();
      nextS = _.debounce(nextSlide, 200);
      svg.on('click', nextS);
      return $('body').on('keypress', function() {
        nextS();
        return false;
      });
    });
  });

}).call(this);
