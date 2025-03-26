var MobiscrollCalendar = {
  init: function(elementId) {
    console.log('Inicializando calendario en:', elementId);
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
          console.log('Evento clickeado:', args.event);
          mobiscroll.toast({
            message: args.event.title
          });
        }
      });
      
      console.log('Calendario inicializado correctamente');
      return inst;
    } catch (error) {
      console.error('Error al inicializar el calendario:', error);
      return null;
    }
  },
  
  loadEvents: function(calendar, url, callback) {
    if (!calendar) {
      console.error('Instancia de calendario inválida');
      return;
    }
    
    try {
      console.log('Cargando eventos desde:', url);
      mobiscroll.getJson(
        url,
        function(events) {
          console.log('Eventos cargados:', events.length);
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
      console.log('Estableciendo eventos locales:', events.length);
      calendar.setEvents(events);
    } catch (error) {
      console.error('Error al establecer eventos locales:', error);
    }
  }
};