package serverest;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ServeRestTest {

    @Test
    void ejecutarSuite() {
        Results results = Runner.path("classpath:serverest")
                .tags("~@ignore")
                .outputCucumberJson(true)
                .parallel(Integer.getInteger("threads", 4)); //numero de hilos para ejecutar en paralelo

        //Si hubo fallas, el test debe fallar y mostrar los mensajes de error
        assertEquals(0, results.getFailCount(), "Hay fallos en la ejecución:\n" + results.getErrorMessages());

    }
}
