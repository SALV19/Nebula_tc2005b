var MobiscrollCalendar = {
  init: function(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
      console.error('Elemento no encontrado:', elementId);
      return null;
    }
    
    if (typeof mobiscroll === 'undefined') {
      console.error('Mobiscroll no está disponible. Verifica que esté cargado.');
      return null;
    }
    
    try {
      var inst = mobiscroll.eventcalendar('#' + elementId, {
        locale: mobiscroll.localeEs,
        theme: 'ios',
        themeVariant: 'light',
        clickToCreate: false,
        dragToCreate: false,
        dragToMove: false,
        dragToResize: false,
        eventDelete: false,
        view: {
          calendar: { labels: true }
        },
        onEventClick: function(args) {
          mobiscroll.toast({
            message: args.event.title
          });
        }
      });
      
      return inst;
    } catch (error) {
      return null;
    }
  },
  
  loadEvents: function(calendar, url, callback) {
    if (!calendar) {
      console.error('Instancia de calendario inválida');
      return;
    }
    
    try {
      mobiscroll.getJson(
        url,
        function(events) {
          calendar.setEvents(events);
          if (typeof callback === 'function') {
            callback(events);
          }
        },
        'jsonp'
      );
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  },
  
  setLocalEvents: function(calendar, events) {
    if (!calendar) {
      console.error('Instancia de calendario inválida');
      return;
    }
    
    try {
      calendar.setEvents(events);
    } catch (error) {
      console.error('Error al establecer eventos locales:', error);
    }
  }
};